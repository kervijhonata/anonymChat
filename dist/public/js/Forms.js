import Element from "./Elements.js"

class Form extends Element {
    constructor(form) {
        this._element = form
    }

    validateFields(fields) {

        const fields = [...fields]
        
    }

    test() {
        return "OK"
    }
}

export default Form