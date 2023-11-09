const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    _projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: false,
        minLength: 1,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    estimatedTime: {
        type: Number,
        required: true
    },
    spentTime: {
        type: Number,
        default: 0,
        required: true
    },
    taskStatus: {
        type: Number,
        required: true,
        default: 0
    },
    statusIndex: {
        type: Number,
        required: true,
        default: 1024
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task}