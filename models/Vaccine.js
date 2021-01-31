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
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Vaccine', vaccineSchema)
