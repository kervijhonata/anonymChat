// import { io } from "../../../node_modules/socket.io/dist/socket"

var socket = io()

const form = document.querySelector("#form-messager")
const inputMessage = document.querySelector("#input-message")
const messagePanel = document.querySelector("#messages")

form.addEventListener("submit", (e) => {

    e.preventDefault()

    sendMessageAll(inputMessage.value)

    inputMessage.value = ""
})

function sendMessageAll(msg){
    // Emit messageEvent with value
    socket.emit("chatMessage", msg)
}

class Message {

    constructor(content) {
        this.sentDate = new Date()
        this.content = {
            text: content.text || null,
            image: content.image || null,
        }
        this.dateTemplate = null

        // Config
        this.setDateTemplate("HH:MM")
    }

    setDateTemplate(templateOption) {

        let option = String(templateOption).toUpperCase()

        switch(option) {
            default:
                // hours:minutes
                this.dateTemplate = `${this.sentDate.getHours()}:${this.sentDate.getMinutes()}`
            break;
            case "HH:MM":
                // hours:minutes
                this.dateTemplate = `${this.sentDate.getHours()}:${this.sentDate.getMinutes()}`
            break;
            case "HH:MM:SS":
                // hours:minutes:seconds
                this.dateTemplate = `${this.sentDate.getHours()}:${this.sentDate.getMinutes()}:${this.sentDate.getSeconds()}`
            break;
        }
    }

    test() {
        console.log(`Message: ${this.text}. Date: ${this.time}`)
        // console.log(this.content.Keys)
        
    }

    get text() {
        return this.content.text
    }

    get image() {
        return this.content.image
    }

    get time() {
        return this.dateTemplate
    }
}

socket.on("chatMessage", (messageContent) => {

    // ex
    const novaMensagem = new Message({
        text: messageContent,
        image: false
    })

    novaMensagem.test()

    var newMessage = document.createElement("p")
    var innerTime = document.createElement("span")

    newMessage.classList.add("message")
    innerTime.classList.add("message-time")

    innerTime.innerText = novaMensagem.time
    newMessage.dataset.timeSent = novaMensagem.time

    newMessage.textContent = novaMensagem.text

    newMessage.appendChild(innerTime)
    messagePanel.appendChild(newMessage)

    var speaker = new Speaker({voice: 1, rate: 1.5})
    speaker.speak(novaMensagem.text)

})

class Speaker {
    constructor(options) {
        { this.options = options }

        this.synth = window.speechSynthesis
        this.tts = new SpeechSynthesisUtterance()
        this.voices = this.synth.getVoices()

        this.tts.voice = this.voices[this.options.voice]
        this.tts.rate = this.options.rate
    }

    speak(message) {
        this.tts.text = message
        this.synth.speak(this.tts)
    }
}