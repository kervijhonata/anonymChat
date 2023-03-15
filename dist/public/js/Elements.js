class Element {
    constructor(element) {
        this._element = element
    }

    on(event, callback) {
        this.element.addEventListener(event, callback)
    }
}

export default Element