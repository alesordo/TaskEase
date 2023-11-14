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
        // required:
        required: false
    },
    estimatedTime: {
        type: Number,
        // required: true
        required: false
    },
    spentTime: {
        type: Number,
        default: 0,
        // required: true
        required: false
    },
    taskStatus: {
        type: Number,
        required: true,
        default: 0
    },
    statusIndex: {
        type: Number,
        required: true
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task}