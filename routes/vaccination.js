const express = require('express')
const Vaccine = require('../models/Vaccine')
const Vaccines = require('../models/Vaccine')
const router = express.Router()


// All vaccines
router.get('/', async (req, res) => {
    try{
        const Vaccines = await Vaccine.find({})
        res.render('vaccines/index', {
            Vaccines: Vaccines 
        })
    } catch {
        res.render('/')
    }})

// New vaccines
router.post('/', async (req, res) => {
    const vaccin = new Vaccine({
        vaccin: req.body.info
    })
    try {
        const newVaccine = await vaccine.save()
        res.redirect('/')
    } catch {
        res.render('vaccines/new', {
            errorMessage: 'Une erreur est servenue'
        })
    }
})


module.exports = router 