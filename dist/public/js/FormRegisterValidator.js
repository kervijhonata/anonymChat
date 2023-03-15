// import Form from "./Forms.js";

class FormRegister {
    constructor(formElement) {
        this._form = formElement
    }

    test() {
        return "Testing"
    }

    validatePasswords(validationMessage, ...passwordFields) {
        
        var fields = passwordFields
        var message = validationMessage

        if(fields.length > 1) {
            fields.forEach(field => {
                console.log(field)
                field.onchange = () => {

                    if(fields[0].value !== fields[1].value) {
                        field.setCustomValidity(message)
                        console.log(message)
                    }else{
                        field.setCustomValidity("")
                        console.log("Okay")
                    }
                }
            })
        }else{
            console.log(fields)
        }
        
    }
}

// const register = new FormRegister(document.querySelector("#form-register"))
// register.validatePasswords(
//     "Passwords don't match.",
//     document.querySelector("#input-password"),
//     document.querySelector("#input-repeat")
// )