// Modules
const express = require("express")

// Config
const router = express.Router()

// Routes
router.get("/", (req, res, next) => {
    res.render("./admin/index")
})

router.get("/categories", (req, res, next) => {
    res.render("./admin/categories")
})

router.get("/events/watcher", (req, res, next) => {
    res.render("./admin/eventwatcher")
})


// Exportion
module.exports = router