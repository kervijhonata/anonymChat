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
        next()
    })


// Routes
app.get("/", (req, res, next) => {
    res.render("index", {
        documentTitle: "AnonymCast"
    })
})

app.post("/login/auth", (req, res, next) => {

    const userDB = require("./db/users.json")
    const formLogin = {
        email: req.body.email,
        password: req.body.password
    }

    // Auth class
    class UserPassport {
        constructor(hash) {
            this._authenticated = false
        }
        authUser(security, auth) {
            if(security) {
                this._authenticated = auth
                return
            }
        }
        isUserAuth() {
            return this._authenticated
        }
    }
    
    const currentUser = new UserPassport()

    userDB.users.forEach((user) => {
        
        if(currentUser.isUserAuth()) return
        if(user.email == formLogin.email && user.passwords[0] == formLogin.password) {
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
    
    const userDB = require("./db/users.json")

    var formRegister = {
        nickname: req.body.nickname,
        email: req.body.email,
        passwords: req.body.password
    }

    let userAlreadyExists = false; // Flag

    // Verify if user already exists
    userDB.users.forEach((user, index) => {
        if(formRegister.email == formRegister.email){
            userAlreadyExists = true
            return
        }
    })

    if(userAlreadyExists) {
        req.flash("errorMessage", "This email is already in use, please verify and try again.")
        res.redirect("/register")
    }
    else {
        userDB.users.push(formRegister)
        fs.writeFile("./dist/db/users.json", JSON.stringify(userDB), (err) => {
            if(err) {
                console.log("An error occurred, can't create a new user")
                req.flash("successMessage", "Your user is registred successfully!")
                res.redirect("/")
            }
            else {
                console.log("User registred successfully")
                req.flash("errorMessage", "An error occurred, try again later.")
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
const admin = require("./routes/admin")
app.use("/admin", admin)

// Server listening
server.listen(PORT, ()=> {
    console.log("listening server on port " + PORT)
})