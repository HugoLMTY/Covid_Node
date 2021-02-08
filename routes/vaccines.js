const express = require('express')
const { collection } = require('../models/Vaccine')
const Vaccine = require('../models/Vaccine')
const Vaccines = require('../models/Vaccine')
const router = express.Router()


// All vaccines
router.get('/', async (req, res) => {

    if (req.cookies['uid'] != undefined){
        const isConnected = true
        try{
            const Vaccines = await Vaccine.find({})
            res.render('vaccines/index', {
                Vaccines: Vaccines,
                isConnected: true
            })
        } catch {
            res.render('/')
        }
    } else {
        try{
            const Vaccines = await Vaccine.find({})
            res.render('vaccines/index', {
                Vaccines: Vaccines,
            })
        } catch {
            res.render('/')
        }
    }
})


// Go to edit page
router.post('/edit', async (req, res) => {

    const current = req.body.VaxListID
    if (req.body.VaxListAction == 'edit'){
        const Vaccines = await Vaccine.findById(current)
        return res.render('vaccines/edit', {
            statusEdit: true,
            vaccine: Vaccines
        })
    } else if (req.body.VaxListAction == 'delete') {
        const toDelete = await Vaccine.findByIdAndDelete(current)
        const Vaccines = await Vaccine.find({})
        try {
            return res.render('vaccines/index', {
                Vaccines: Vaccines,
                successMessage: 'L\'élément a bien été supprimé'
            })
        } catch {
            return res.render('vaccines/index', {
                Vaccines: Vaccines,
                errorMessage: 'Une erreur est survenue'
            })
        }
    }
    
})

// Edit vaccine
router.post('/edited', async (req, res) => {

    const newValues = {
        $set: {
            name: req.body.VaxName,
            totalVaccines: req.body.VaxTotal,
            code: req.body.VaxCode,
            date: req.body.VaxDate
        }
    }
    const toUpdate = await Vaccine.findByIdAndUpdate(req.body.VaxEditID, newValues)
    const Vaccines = await Vaccine.find({})

    try {
        return res.render('vaccines/index', {
            Vaccines: Vaccines,
            successMessage: 'L\'élément a bien été mis à jour'
        })
    } catch {
        return res.render('vaccines/index', {
            Vaccines: Vaccines,
            errorMessage: 'Une erreur est survenue'
        })
    }
})


// New vaccines
router.get('/new', async (req, res) => {
    res.render('vaccines/new', { vaccine: new Vaccine() })
})

// Create Vaccine
router.post('/', async (req, res) => {
    const vaccine = new Vaccine({
        name: req.body.VaxName,
        totalVaccines: req.body.VaxTotal,
        code: req.body.VaxCode,
        date: req.body.VaxDate,
    })
    try {
        const newVaccine = await vaccine.save()
        res.redirect('vaccines')
    } catch {
        res.render('vaccines/new',{
            vaccine: vaccine,
            errorMessage: 'Une erreur est survenue'
        })
    }
})

module.exports = router 