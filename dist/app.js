// Modules
const express = require("express")
const hbs = require("express-hbs")
const path = require("path")
const http = require("http")
const { Server } = require("socket.io")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const fs = require("fs")


// Server info 
const PORT = 8081

// Configs

    // App instance
    const app = express()

    // Server instance
    const server = http.createServer(app)
    const io = new Server(server)

    // View engine
    app.engine("hbs", hbs.express3({
        partialsDir: path.resolve(__dirname + "/views/partials"),
        layoutsDir: path.resolve(__dirname + "/views/layouts"),
        defaultLayout: path.resolve(__dirname + "/views/layouts/main")
    }))
    app.set("view engine", "hbs")
    app.set("views", path.resolve(__dirname + "/views"))
    
    // Static files
    app.use(express.static(path.join(__dirname, "./public")))
    
    // BodyParser
    app.use(bodyParser.urlencoded({extended: true}))

    // Session
    app.use(session({
        maxAge: 60000,
        secret: "Can Mercury bless this app?",
        saveUninitialized: true,
        resave: false
    }))

    // Cookie Parser
    app.use(cookieParser())

    // ConnectFlash
    app.use(flash())

    // Local variables
    app.use( function(req, res, next) {
        app.locals.successMessage = req.flash("successMessage")
        app.locals.errorMessage = req.flash("errorMessage")
        app.locals.errors = req.flash("errors")
        next()
    })


// Routes
app.get("/", (req, res, next) => {
    res.render("index", {
        documentTitle: "AnonymCast"
    })
})

app.post("/login/auth", (req, res, next) => {

    const UserPassport = require("./modules/UserPassport")
    const userDB = require("./db/users.json")

    const formLogin = {
        email: req.body.email,
        password: req.body.password
    }
    
    const currentUser = new UserPassport()

    userDB.users.forEach((user) => {
        
        if(currentUser.isUserAuth()) return
        if(user.email == formLogin.email && user.password == formLogin.password) {
            currentUser.authUser(true, true)
            return
        }

    })

    if(currentUser.isUserAuth()) {
        req.flash("successMessage", "Logged successfully!")
        res.redirect("/messager")
    }else{
        req.flash("errorMessage", "Please verify your data and try again.")
        res.redirect("/")
    }

})

app.get("/admin/users", (req, res, next) => {
    
    const userDB = require("./db/users.json")

    const users = userDB.users

    res.send(userDB)
    console.log(users)

})

app.get("/register", (req, res, next) => {
    res.render("register", {
        documentTitle: "Create your Account | AnonymCast"
    })
})

app.post("/register/auth", (req, res, next) => {
    
    // Module
    const userDB = require("./db/users.json")

    // Capturing form
    var formRegister = {
        nickname: req.body.nickname,
        email: req.body.email,
        passwords: req.body.password
    }

    // Errors
    const formErrors = []
    var userAlreadyExists = false // Flag


    // Verify if user already exists
    userDB.users.forEach((user, index) => {
        if(formRegister.email == user.email){
            userAlreadyExists = true
            formErrors.push({text: "Error: This email is already in use, try another one", type: "warn-message"})
            return
        }
    })

    // Nickname check
    if(typeof formRegister.nickname == undefined || formRegister.nickname == false || formRegister.nickname == null){
        formErrors.push({text: "Error: Please set a nickname", type: "error-message"})
    }
    if(formRegister.nickname.length < 2 || formRegister.nickname.length > 30){
        formErrors.push({text: "Error: Your nickname must have 2 to 30 characters long", type: "warn-message"})
    }
    // Email check
    if(typeof formRegister.email == undefined || formRegister.email == false || formRegister.email == null){
        formErrors.push({text: "Error: Please set a email", type: "error-message"})
    }
    if(formRegister.email.length < 8 || formRegister.email.length > 255){
        formErrors.push({text: "Error: Your email must have 8 to 255 characters long, including @", type: "error-message"})
    }
    // Passwords check
    if(formRegister.passwords[0].length < 8 || formRegister.passwords[1].length < 8){
        formErrors.push({text: "Error: Passwords must be at least 8 characters long", type: "error-message"})
    }
    if(formRegister.passwords[0] !== formRegister.passwords[1]){
        formErrors.push({text: "Error: Both passwords don't match", type: "warn-message"})
    }


    if(formErrors.length > 0) {

        // set errors ID
        formErrors.forEach((error, i) => error.errorID = i)

        req.flash("errors", formErrors)
        res.redirect("/register")
        return 

    }
    else {

        const newUser = {
            nickname: formRegister.nickname,
            email: formRegister.email,
            password: formRegister.passwords[0]
        }

        userDB.users.push(newUser)
        fs.writeFile("./dist/db/users.json", JSON.stringify(userDB), (err) => {
            if(err) {
                console.log("An error occurred, can't create a new user")
                req.flash("errorMessage", "An error occurred, try again later.")
                res.redirect("/")
            }
            else {
                console.log("User registred successfully")
                req.flash("successMessage", "Your user is registred successfully!")
                res.redirect("/")
            }
        })
    }
})

app.get("/messager", (req, res, next) => {

    res.render("messager")

})

// Net Sockets
io.on('connection', (socket) => {
    console.log("A new user connected")

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })

    socket.on("chatMessage", (message) => {
        
        // console.log(`Message: ${message}`)
        io.emit("chatMessage", message)
    })
})

// External routes
const adminRoute = require("./routes/admin")
app.use("/admin", adminRoute)

const testRoute = require("./routes/test")
const { error } = require("console")
app.use("/test", testRoute)

// Server listening
server.listen(PORT, ()=> {
    console.log("listening server on port " + PORT)
})