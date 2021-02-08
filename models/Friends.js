const mongoose = require('mongoose')

const friendSchema = new mongoose.Schema({
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Friend', friendSchema)
