import EventEngine from "./EventEngine.js"

class OutputPrinter {
    constructor(outputElement) {
        this.outputElement = outputElement
    }
    print(message) {
        this.createMessage(message, ">")
    }
    createMessage(text, detail) {
        const $messageElement = document.createElement("p")
        const $messageDetail = document.createElement("span")

        $messageDetail.innerText = detail + " "
        $messageElement.innerText = text
        $messageElement.prepend($messageDetail)

        this.outputElement.prepend($messageElement)
    }
}

/** USAGE */

const output = new OutputPrinter(document.querySelector("#output"))
const event = new EventEngine()


event.on("buttonClick", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})
event.on("formSubmit", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})
event.on("informational response", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})
event.on("successfull response", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})
event.on("redirection message", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})
event.on("client error response", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})
event.on("server error response", args => {
    output.print(event.getEventResponseTemplate(args.name, args.status, args.text))
})

const $form = document.querySelector("#wrapper-controls")
$form.onsubmit = function (e) {
    e.preventDefault()

    let $select = e.target.querySelector("#select-eventType")
    let selectedEvent = $select.value

    if (selectedEvent !== "") {
        event.emit("formSubmit", {
            name: selectedEvent,
            status: 100,
            text: `A <${selectedEvent}> event was detected`
        })
    }
    else {
        event.emit("formSubmit", {
            name: "formSubmit",
            status: 400,
            text: "Please select an event option before submit"
        })
    }
}

const $btnEmit = document.querySelector("#btn-submit")
$btnEmit.onclick = function (e) {
    try {
        event.emit("buttonClick", {
            name: "buttonClick",
            status: 100,
            text: `Button ${e.target.dataset.reference} was pressed`
        })
    }
    catch (err) {
        console.log(err)
    }
}