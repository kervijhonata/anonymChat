// Modules
const express = require("express")

// Config
const router = express.Router()


// Routes
router.get("/", (req, res, next) => {
    res.render("./test/index")
})

router.get("/login", (req, res, next) => {

    // const userDB = require("../db/users.json")
    // const users = new Set(userDB.users)

    // console.log(users)

    // users.find({
    //     nickname: 'teste',
    //     email: 'teste@teste.com',
    //     passwords: [ 'teste000', 'teste000' ]
    //   }, value => {
    //     console.log(value)
    //   }))

    // res.send(userDB)
})


module.exports = router