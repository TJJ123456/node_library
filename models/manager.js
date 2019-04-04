const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const managerSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
})

exports.Manager = mongoose.model('Manager', bookcommentsSchema);