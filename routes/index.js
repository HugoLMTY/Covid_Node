const express = require('express')
const router = express.Router()
const Vaccine = require('../models/Vaccine')


router.get('/', (req, res) => {
    res.render('index')
})


module.exports = router 