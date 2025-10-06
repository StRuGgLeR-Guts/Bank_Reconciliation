import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the reconciliation report.'],
        trim: true,
        maxlength: [100, 'Report name cannot be more than 100 characters.']
    },
    reportData: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;
