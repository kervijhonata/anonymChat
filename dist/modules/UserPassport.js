class UserPassport {
    
    #authenticated

    constructor(hash) {
        this.#authenticated = false
    }
    authUser(security, auth) {
        if(security) {
            this.#authenticated = auth
            return
        }
    }
    isUserAuth() {
        return this.#authenticated
    }
}

module.exports = UserPassport