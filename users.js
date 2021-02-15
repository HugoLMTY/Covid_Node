const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt')
const { render } = require('ejs')
const Friends = require('../models/Friends')

// Profile infos
router.get('/', async (req, res) => {

    if (req.cookies['uid'] == undefined){
        return res.redirect('/users/login')
    }

    _uname = req.cookies['uname']
    _uid = req.cookies['uid']
    
    //#region later alligator
    // TROUVER L'ID A RETIRER EN BOUCLANT A TRAVERS TOUTES LES VALEURS JUSQU'A TROUVER LA BONNE
    // let sentList = await Friends.find({})
    // let allList = await User.find({})
    // const finalList = []

    // 1 - LISTER TOUS LES ID ET RETIRER CHAQUE FOIS QU'UN ID CORRESPOND PUIS AJOUTER TOUS LES RESTANTS A UNE LISTE
    // let i = 0
    // let x = 0
    // while (i < sentList.length) {
    //     while (x < allList.length) {
    //         if (sentList[i].user2 != allList[x]._id){
    //             console.log('sent: ', sentList[i].user2)
    //             console.log('all: ', allList[x]._id)
    //             console.log('')
    //             finalList.push(allList[x])
    //         }
    //         x++
    //     }
    //     i++
    // }

    // 1 - LISTER TOUS LES _ID ET FIND LE USER2 CORRESPONDANT A CHAQUE ITERATION
    // let i = 0
    // let x = 0
    // while (i < allList.length) {
    //     if (!allList.find(sentList[i].user2)){
    //         finalList.push(allList[x])
    //     }
    // i++
    // }
    
    // 3 - BOUCLER UNE REQUETE EN RETIRANT LES ID USER2 DU RESULTAT
    // for (element of sentList){
        //         finalList.push( await User.findOne({ _id:{ $ne: allList.user2.includes }}, {_id:1, mail:1, name:1}) )
        // }
        // console.log(finalList[0])
        
    // console.log(finalList)
    //#endregion

    const friendsSentById = await Friends.find({ user1: _uid, status: 'sent' }, {_id:0, user2:1})
    const friendsAcceptedById = await Friends.find({ user1: _uid, status: 'accepted' }, {_id:0, user1:1, user2:1})
    const _friendsAcceptedById = await Friends.find({ user2: _uid, status: 'accepted' }, {_id:0, user1:1, user2:1})
    const friendsReceivedById = await Friends.find({ user2: _uid, status: 'sent' }, {_id:0, user1:1, user2:1})
    const friendsSentCount = await Friends.countDocuments({ user1: _uid, status: 'sent' })
    const friendsAcceptedCount = await Friends.countDocuments({ user1: _uid, status: 'sent' })
    const _friendsAcceptedCount = await Friends.countDocuments({ user2: _uid, status: 'sent' })
    const friendsReceivedCount = await Friends.countDocuments({ user2: _uid, status: 'sent' })

    let idSentList = []
    friendsSentById.forEach(element => {
        idSentList.push(element.user2)
    });

    let idAcceptedList = []
    friendsAcceptedById.forEach(element => {
        idAcceptedList.push(element.user2)
    });
    _friendsAcceptedById.forEach(element => {
        idAcceptedList.push(element.user1)
    });

    let idReceivedList = []
    friendsReceivedById.forEach(element => {
        idReceivedList.push(element.user1)
    });
    const userList = await User.find({
        $and: [
            { _id: { $nin: idSentList }},
            { _id: { $nin: idAcceptedList }},
            { _id: { $nin: idReceivedList }},
            { _id: {$ne: _uid}}
        ]
    })

    const userSentList = await User.find({ _id: { $in: idSentList } })
    const userAcceptedList = await User.find({ _id: { $in: idAcceptedList } })
    const userReceivedList = await User.find({ _id: { $in: idReceivedList } })

    console.log(_uid)
    console.log(userAcceptedList)

    try {
        return res.render('users/profil', {
            Users: userList,
            Sent: userSentList,
            Accepted: userAcceptedList,
            Received: userReceivedList,
            SentCount: friendsSentCount,
            AcceptedCount: userAcceptedList,
            ReceivedCount: friendsReceivedCount,
            uname: _uname,
            uid: _uid,
            isConnected: true
        })
    } catch {
        return res.render('users/profil', {
            Users: userList,
            uname: _uname,
            uid: _uid,
            errorMessage: 'Une erreur est survenue'
        })
    }
})

// Send invite
router.post('/sendInvite', async (req, res) => {

    const friendId = req.body.userID
    const friendRequest = new Friends({
        user1: req.cookies['uid'],
        user2: friendId,
        status: 'sent'
    })
    try {
        const newRequest = await friendRequest.save()
        res.redirect('/users/')
    } catch(e) {
        res.redirect('/users/profil')
    }
})
// Action invite
router.post('/actionInvite', async (req, res) => {
    const result = req.body.userInvite

    const _uname = req.cookies['uname']
    const _uid = req.cookies['uid']

    if (!result){
        console.log('Demande de', req.body.receivedName ,'supprimée')
    } else {
        const toUpdate = await Friends.findOneAndUpdate({
            $and: [
                { user2: _uid},
                { user1: req.body.receivedID}
            ]
        }, {status: 'accepted'} )
    }
    return res.redirect('/users/')
})
// Cancel invite
router.post('/cancelInvite', async (req, res) => {
    const toCancel = await Friends.findOneAndDelete({user2: req.body.userCancelID})
    return res.redirect('/users/')
})
// Delete invite
router.post('/deleteInvite', async (req, res) => {

    const _uname = req.cookies['uname']
    const _uid = req.cookies['uid']

    const toDelete = await Friends.findOneAndDelete({
        $or: [
            {$and: [
                { user1: _uid},
                { user2: req.body.userDeleteInviteID}
            ]},
            {$and: [
                { user2: _uid},
                { user1: req.body.userDeleteInviteID}
            ]}
        ]
    })
    console.log(toDelete)
    return res.redirect('/users/')
})



// Register
router.get('/register', async (req, res) => {
    if (req.cookies['uid'] == undefined)
        return res.render('users/register')
    else
        return res.redirect('/users')
})

// Login
router.get('/login', async (req, res) => {
    if (req.cookies['uid'] == undefined)
        return res.render('users/login')
    else
        return res.redirect('/users')

})

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('uname')
    res.clearCookie('uid')
    return res.redirect('/')
})


// Login user
router.post('/login', async (req, res) => {

    let loginOptions = {}
    loginOptions.mail = new RegExp(req.body.loginMail)
    
    const loginUser = await User.find(loginOptions)
    if (loginUser == '') {
        return res.render('users/login', {
            errorMessage: 'Aucun utilisateur trouvé'
        }) 
    } else {
            // if (loginUser[0].password == req.body.loginPassword){
                const hashCompare = bcrypt.compare(req.body.loginPassword, loginUser[0].password)
            if (hashCompare){
                const  {id, name, mail, password} = loginUser[0]
                res.cookie('uid', id, {expires: new Date(2069, 0, 1)})
                res.cookie('uname', name, {expires: new Date(2069, 0, 1)})
                res.cookie('isConnected', true, {expires: new Date(2069, 0, 1)})
                return res.redirect('/users')
            } else {
                return res.render('users/login', {
                    errorMessage: 'Mot de passe incorrect'
                }) 
            }
        }
})
// Create user
router.post('/register', async (req, res) => {
    
    const hash = await bcrypt.hash(req.body.registerPassword, 10) 
    const mailList = await User.find({}).distinct('mail')

    const user = new User({
        name: req.body.registerName,
        mail: req.body.registerMail,
        password: hash,
    })

    if (mailList.indexOf(req.body.registerMail) != -1){
        res.render('users/register', {
            errorMessage: 'Un compte existe deja avec cette adresse.',
            errorLogin: true
        })
    } else {
        if (req.body.registerPassword ==  req.body.registerPasswordConfirm){
            try {
                const newUser = await user.save()
                res.render('users/login', {
                    successMessage: 'Compte créé'
                })
            } catch {
                res.render('users/register', {
                    errorMessage: 'Une erreur est survenue'
                })
            }
        } else {
        res.render('users/register', {
            errorMessage: 'Les mots de passes ne correspondent pas'
        })
        }
    }
})
// Delete user
router.post('/delete', async (req,res) => {
    res.clearCookie('uname')
    res.clearCookie('uid')
    const toDelete =  await User.findById(req.body.deleteUser)
    console.log(toDelete)
    return res.render('index/')
})

module.exports = router 