const express = require('express')
const Region = require('../models/Region')
const router = express.Router()

// All vaccines by region
router.get('/', async (req, res) => {

    const region = new Region()
    
    let searchOptions = {}
    let sortOption = {}
    const currentDate = req.query.RegionDate
    const currentCode = req.query.RegionCode
    const currentNom = req.query.RegionNom
    const currentSorting = req.query.RegionSort
    var currentSort = '-'
    
    
    if (req.query.RegionNom)
        searchOptions.nom = req.query.RegionNom
    if (req.query.RegionCode)
        searchOptions.code = new RegExp(req.query.RegionCode, 'i')
    if (req.query.RegionDate)
        searchOptions.date = new RegExp(req.query.RegionDate, 'i')
    switch (req.query.RegionSort) {
        case 'sort_nom':
            sortOption = {
                nom: -1
            }
            currentSort = 'Nom ↑'
            break;
        case 'sort_vaccins_':
            sortOption = {
                totalVaccines: -1
            }
            currentSort = 'Nb de vaccins ↓'
            break;
        case 'sort_code':
            sortOption = {
                code: -1
            }
            currentSort = 'Code ↑'
            break;
        case 'sort_date':
            sortOption = {
                date: -1
            }
            currentSort = 'Date ↑'
            break;
        case 'sort_nom_':
            sortOption = {
                nom: 1
            }
            currentSort = 'Nom ↓'
            break;
        case 'sort_vaccins':
            sortOption = {
                totalVaccines: 1
            }
            currentSort = 'Nb de vaccins ↑'
            break;
        case 'sort_code_':
            sortOption = {
                code: 1
            }
            currentSort = 'Code ↓'
            break;
        case 'sort_date_':
            sortOption = {
                date: 1
            }
            currentSort = 'Date ↓'
            break;
        case 'sort_blank_':
            sortOption = {
            }
            currentSort = '-'
            break;
            
    }

    if (req.cookies['uid'] != undefined){
        
        try {
            const Dates = await Region.find({}).distinct('date')
            const Codes= await Region.find({}).distinct('code')
            const Noms = await Region.find({}).distinct('nom')
            const Regions = await Region.find(searchOptions).sort(sortOption)
            res.render('regions/index', {
                currentDate: currentDate,
                currentCode: currentCode,
                currentNom: currentNom,
                currentSort: currentSort,
                currentSorting: currentSorting,
                region: region,
                Regions: Regions,
                Dates: Dates,
                Codes: Codes,
                Noms: Noms,
                searchOptions: req.query,
                isConnected: true
            })
        } catch(err) {
            console.log(err)
            res.redirect('/')
            
        }
    } else {

        try {
            const Dates = await Region.find({}).distinct('date')
            const Codes= await Region.find({}).distinct('code')
            const Noms = await Region.find({}).distinct('nom')
            const Regions = await Region.find(searchOptions).sort(sortOption)
            res.render('regions/index', {
                currentDate: currentDate,
                currentCode: currentCode,
                currentNom: currentNom,
                currentSort: currentSort,
                currentSorting: currentSorting,
                region: region,
                Regions: Regions,
                Dates: Dates,
                Codes: Codes,
                Noms: Noms,
                searchOptions: req.query,
            })
        } catch(err) {
            console.log(err)
            res.redirect('/')
            
        }
    }
})

// // Create DB Collection
// router.post('/', async (req, res) => {
//     const region = new Region({
//         date: req.body.RegionDate,
//         code: 'REG-00',
//         nom: 'Somewhere',
//         totalVaccines: 1
//     }) 
//     console.log(region)
//     try {
//         const newRegion = await region.save()
//         res.redirect('regions', {
//             region: region
//         })
//     } catch {
//         res.render('regions/index', {
//             region: region,
//             errorMessage: 'Une erreur est survenue'
//         })
//     }
// })


module.exports = router 