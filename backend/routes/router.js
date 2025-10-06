import express from "express";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import { upload } from "../multer/multer.js";
import axios from "axios";
import FormData from "form-data";
import "dotenv/config";
// --- NEW: Imports for file exporting ---
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// --- NEW: Import the Mongoose model for saving reports ---
import Report from "../models/reports.js";

const router = express.Router();

const FASTAPI_URL =
  process.env.FASTAPI_URL || "http://localhost:8001/reconcile/";

router.post(
  "/reconcile",
  upload.fields([
    { name: "bankStatement", maxCount: 1 },
    { name: "internalRecords", maxCount: 1 },
  ]),
  async (req, res) => {
    const bankFile = req.files?.["bankStatement"]?.[0];
    const internalFile = req.files?.["internalRecords"]?.[0];

    if (!bankFile || !internalFile) {
      return res.status(400).json({
        status: "error",
        message:
          "Both 'bankStatement' and 'internalRecords' files are required.",
      });
    }

    try {
      const formData = new FormData();
      formData.append(
        "bank_statement",
        fs.createReadStream(bankFile.path),
        bankFile.originalname
      );
      formData.append(
        "internal_records",
        fs.createReadStream(internalFile.path),
        internalFile.originalname
      );

      console.log(`Forwarding files to AI service at ${FASTAPI_URL}`);

      const fastAPIResponse = await axios.post(FASTAPI_URL, formData, {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      return res.status(200).json(fastAPIResponse.data);
    } catch (error) {
      console.error(
        "Error during reconciliation proxy:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.detail ||
        "Reconciliation failed due to an internal server error.";
      const statusCode = error.response?.status || 500;
      return res.status(statusCode).json({
        status: "error",
        message: errorMessage,
      });
    } finally {
      try {
        if (bankFile?.path) await fsPromises.unlink(bankFile.path);
        if (internalFile?.path) await fsPromises.unlink(internalFile.path);
        console.log("Cleaned up temporary files successfully.");
      } catch (cleanupError) {
        console.error(
          "CRITICAL: Failed to clean up temporary files:",
          cleanupError
        );
      }
    }
  }
);

/**
 * --- NEW: API Endpoint to Save a Report ---
 * Receives the report name and data from the frontend and saves it to MongoDB.
 */
router.post("/reports", async (req, res) => {
  try {
    const { name, reportData } = req.body;

    if (!name || !reportData) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Report name and data are required.",
        });
    }

    // Create a new report document using the Mongoose model
    const report = new Report({
      name,
      reportData,
    });

    // Save the document to the database
    await report.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Report saved successfully!",
        data: report,
      });
  } catch (error) {
    console.error("Error saving report to MongoDB:", error);
    // Provide more detail if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error while saving report." });
  }
});

/**
 * --- API Endpoint to GET all saved reports (with pagination) ---
 * Fetches a paginated list of report names and creation dates.
 */
router.get("/reports", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Show 10 reports per page
    const skip = (page - 1) * limit;

    // Find reports in the database, sorted by newest first
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name createdAt"); // Important: Only fetch the data needed for the list view

    // Get the total number of reports for pagination
    const totalReports = await Report.countDocuments();
    const totalPages = Math.ceil(totalReports / limit);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: { currentPage: page, totalPages },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching reports.",
      });
  }
});

/**
 * --- API Endpoint to GET a single report by its ID ---
 * Fetches the full data for a single report when a user clicks on it.
 */
router.get("/reports/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found." });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching single report:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error while fetching the report.",
      });
  }
});

// --- Export Endpoint ---
router.post("/export", async (req, res) => {
  const reportData = req.body;
  const { type } = req.query; // 'excel' or 'pdf'

  if (!reportData) {
    return res.status(400).json({ message: "Report data is required." });
  }

  try {
    if (type === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Reconciliation Report");

      // --- Helper to add a table ---
      const addTable = (title, data, columns) => {
        sheet.addRow([title]).font = { bold: true, size: 14 };
        sheet.addRow(columns.map((c) => c.header)).font = { bold: true };
        data.forEach((row) => {
          sheet.addRow(columns.map((c) => row[c.key]));
        });
        sheet.addRow([]); // Spacer
      };

      // --- Add data to Excel ---
      addTable(
        "Matched Transactions",
        reportData.matched_transactions.map((t) => ({
          ...t.bank,
          vendor: t.internal.Vendor,
          confidence: t.confidence,
        })),
        [
          { header: "Date", key: "Date" },
          { header: "Bank Description", key: "Description" },
          { header: "Amount", key: "Amount" },
          { header: "Matched Vendor", key: "vendor" },
          { header: "Confidence", key: "confidence" },
        ]
      );

      addTable("Anomalies Detected", reportData.anomalies_detected, [
        { header: "Date", key: "Date" },
        { header: "Description", key: "Description" },
        { header: "Amount", key: "Amount" },
        { header: "Reason", key: "Flagged_Reason" },
      ]);
      addTable(
        "Unmatched Bank Transactions",
        reportData.unmatched_bank_transactions,
        [
          { header: "Date", key: "Date" },
          { header: "Description", key: "Description" },
          { header: "Amount", key: "Amount" },
        ]
      );
      addTable(
        "Unmatched Internal Records",
        reportData.unmatched_internal_records,
        [
          { header: "Date", key: "Date" },
          { header: "Vendor", key: "Vendor" },
          { header: "Amount", key: "Amount" },
        ]
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reconciliation_report.xlsx"'
      );
      await workbook.xlsx.write(res);
      res.end();
    } else if (type === "pdf") {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reconciliation_report.pdf"'
      );
      doc.pipe(res);

      // --- PDF content ---
      doc.fontSize(18).text("Reconciliation Report", { align: "center" });
      doc.moveDown();

      const addPdfTable = (title, data, columns) => {
        if (!data || data.length === 0) return;
        doc.fontSize(14).text(title, { underline: true });
        doc.moveDown(0.5);
        const tableTop = doc.y;
        const itemX = 30;

        const columnWidths = {
          // Simple layout
          Date: 80,
          Description: 200,
          Amount: 70,
          Vendor: 120,
        };

        // Headers
        doc.fontSize(10).font("Helvetica-Bold");
        let currentX = itemX;
        columns.forEach((col) => {
          doc.text(col.header, currentX, doc.y, {
            width: columnWidths[col.header] || 100,
          });
          currentX += columnWidths[col.header] || 100;
        });
        doc.moveDown();

        // Rows
        doc.font("Helvetica");
        data.forEach((row) => {
          currentX = itemX;
          columns.forEach((col) => {
            doc.text(String(row[col.key] || ""), currentX, doc.y, {
              width: columnWidths[col.header] || 100,
            });
            currentX += columnWidths[col.header] || 100;
          });
          doc.moveDown();
        });
        doc.moveDown();
      };

      addPdfTable(
        "Matched Transactions",
        reportData.matched_transactions.map((t) => ({
          ...t.bank,
          Vendor: t.internal.Vendor,
        })),
        [
          { header: "Date", key: "Date" },
          { header: "Description", key: "Description" },
          { header: "Amount", key: "Amount" },
          { header: "Vendor", key: "Vendor" },
        ]
      );
      addPdfTable("Anomalies Detected", reportData.anomalies_detected, [
        { header: "Date", key: "Date" },
        { header: "Description", key: "Description" },
        { header: "Amount", key: "Amount" },
      ]);

      doc.end();
    } else {
      res.status(400).send("Invalid export type");
    }
  } catch (error) {
    console.error("Failed to export report:", error);
    res.status(500).send("Failed to generate report.");
  }
});

export default router;
