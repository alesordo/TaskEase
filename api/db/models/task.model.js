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
    kanbanPosition: {
        type: Number,
        required: true,
        default: 0
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task}