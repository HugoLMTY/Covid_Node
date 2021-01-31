const express = require('express')
const Author = require('../models/Author')
const authors = require('../models/Author')
const router = express.Router()


// All authors
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name != '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.render('/')
    }
})

// New authors
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Create
router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Une erreur est survenue'
        })
    }
})


module.exports = router 