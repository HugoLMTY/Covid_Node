const mongoose = require('mongoose')

const regionSchema = new mongoose.Schema({
    nom: {
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
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Region', regionSchema)
