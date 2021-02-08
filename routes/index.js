const express = require('express')
const router = express.Router()
const Vaccine = require('../models/Vaccine')


router.get('/', (req, res) => {
    if (req.cookies['uid'] != undefined)
    {
        res.render('index', {
            isConnected: true
        })
    } else {
        res.render('index')
    }
})


module.exports = router 