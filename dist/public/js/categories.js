const $form = document.querySelector("#register-container")
const $categoryContainer = document.querySelector("#categories-container")
const $input = $form.querySelector("#category-input")
const $btnRemoveAll = document.querySelector("#btn-removeAll")
const $btnSendAll = document.querySelector("#btn-sendAll")

$form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Create category
    const $category = document.createElement("span")
    $category.classList.add("category")

    let textValue = $input.value

    let $categories = document.querySelectorAll("span.category")

    $category.dataset.reference = $categories.length + 1
    $category.innerText = textValue
    $category.onclick = removeItself

    $categoryContainer.appendChild($category)
    $input.value = ""
})


function removeItself(e) {
    const $category = e.target

    console.log($category)
    $categoryContainer.removeChild($category)
}

function updateCategoriesData(categories) {
    const $categories = $categoryContainer.querySelectorAll(".category")
    if($categories && $categories.length > 1) {
        $categories.forEach((category, index) => {
            // ID template
            category.id = `category-${index}`
            category.classList.reference = index
            category.innerText = category.innerText + " " + category.classList.reference
        })
    }
}

$btnSendAll.onclick = sendAllCategories
function sendAllCategories(e) {
    var $categories = $categoryContainer.querySelectorAll("span.category")

    if($categories) {
        console.log("Sending categories..")

        $categories.forEach((category, index) => {
            console.log(category.innerText)     
        })

        console.log("All categories is sent successfully!")
    }
    else {
        console.log("There are no categories to send. Please add one and try again.")
    }
}

$btnRemoveAll.onclick = removeAllCategories
function removeAllCategories() {

    var $categories = $categoryContainer.querySelectorAll("span.category")

    if($categories) {
        console.log("Removing categories..")
        $categories.forEach((category, index) => {
            $categoryContainer.removeChild(category)
            console.log("All categories removed successfully!")
        })
        
    }
    else {
        console.log("There are no categories to remove.")
    }
}


class Popupper {
    constructor( options ){

        // this.dialogTitle = options.title || null
        // this.dialogMessage = options.message || null

        // this.classList = options.classList || "popupper"
        this.dialog = document.createElement("dialog")

        this.Notifier = this.Notifier ?? {
            signal: this.signal ?? null,
            events: []
        }
    }

    createModal(options) {

        this.dialog.classList.add("popupper","modal")

        if(options.header) {
            let header = document.createElement("header")
            if(options.header.title) {
                header.innerText = options.header.title
                this.dialog.appendChild(header)
            }
        }

        if(options.main) {
            let main = document.createElement("main")
            if(options.main.text) {
                main.innerText = options.main.text
                this.dialog.appendChild(main)
            }
        }

        if(options.footer) {
            let footer = document.createElement("footer")
            let button = document.createElement("button")
            if(options.footer.text) {
                
                // button.setAttribute("onclick", Popupper.close)
                button.innerText = options.footer.text

                footer.appendChild(button)
                this.dialog.appendChild(footer)
            }
        }

        window.document.body.appendChild(this.dialog)
    }

    show(mode) {
        switch(mode) {
            default: 
            this.dialog.show()
            break;
            case "modal":
            this.dialog.showModal()
            break;
        }
    }

    static close() {
        this.dialog.close()
    }

    on(event, cb) {

        // Subscribe event
        this.Notifier.events.push({event, cb})
        
        console.log(this.Notifier.events)

        this.Notifier.events.forEach((evt, index) => {

            if(event == evt.event){
                console.log("Evento cadastrado com sucesso!")
                // console.log(this.Notifier.events)
                return
            }

        })

    }

    emit(event, value) {

        try {
            // Register a event as a signal
            this.Notifier.signal = event
    
            // Seach event
            this.Notifier.events.forEach((evt, index) => {
                if(evt.event == event) {
    
                    this.Notifier.signal = event
                    // execute
                    evt.cb(value)

                    return
                }
            })

            // Stop if signal is registred
            if(this.Notifier.signal) {
                return
            }
            else if(this.Notifier.signal !== event){
                // Return error
                throw new Error(`There's no event registred with [${event}] name.`)
            }
        }
    
        catch(err) {
            console.log(err)
        }
    }

}

// Using PopUpper class
const removeAlert = new Popupper()

removeAlert.createModal({
    header: {
        title: "Teste"
    },
    main: {
        text: "Lorem ipsum dolor sit amet"
    },
    footer: {
        text: "Ok"
    }
})

removeAlert.on("success", function(message){
    console.log(message)
})
removeAlert.on("error", function(status){
    console.log(status)
})
removeAlert.on("loadModal", function(mode){
    removeAlert.show(mode)
})


$btnSuccessEmitter = document.querySelector("#btn-emitSuccessEvent")
$btnSuccessEmitter.onclick = function() {

    removeAlert.emit("success", "Sending [success] event")
}


$btnErrorEmitter = document.querySelector("#btn-emitErrorEvent")
$btnErrorEmitter.onclick = () => {
    removeAlert.emit("error", "Sending [error] event with this message")
    removeAlert.emit("loadModal", "modal")
}