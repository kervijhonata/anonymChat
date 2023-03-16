class EventEngine {
    constructor() {
        this.events = new Set()
        this.callbacks = new Map()
        this.signal = null
    }

    on(event, cb) {
        if (!this.events.has(event)) {
            this.events.add(event)
            this.callbacks.set(event, cb)
            return
        }
    }

    emit(event, args) {
        if (this.events.has(event)) {
            this.signal = event
            const cb = this.callbacks.get(event)
            cb(args)
            return
        }
        else {
            throw new ReferenceError(`There is no event registred with <<${event}>> name`)
        }
    }

    detach(event) {
        if (this.events.has(event)) {
            this.events.delete(event)
        }
        else{
            throw new ReferenceError(`There is no event registred with ${event} name, can't detach it`)
        }
    }

    getEventResponseTemplate(eventName, eventStatusCode, eventText) {
        // Template: EVENTNAME[000]: Event occured
        const eventResponseTemplate = `${String(eventName).toUpperCase()}[${eventStatusCode}]: ${eventText}`
        return eventResponseTemplate
    }
}

export default EventEngine