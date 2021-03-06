const mongoose = require('mongoose')

const vaccineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    totalVaccines: {
        type: Number,
        required: true
    },

    code: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: false,
        default: Date.now
    }
})

module.exports = mongoose.model('Vaccine', vaccineSchema)
