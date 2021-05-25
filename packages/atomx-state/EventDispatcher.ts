class Event {
    name:String;
    handler:Function;

    constructor(name:string, handler:Function){
        this.name = name;
        this.handler = handler;
    }
}

export default class EventDispatcher {
    eventsList:Array<Event> = [];

    on(eventName:string, handler:Function) {
        for (let i in this.eventsList) {
            let event = this.eventsList[i];
            if (event.name === eventName && event.handler === handler) return;
        }
        this.eventsList.push(new Event(eventName, handler));
    };

    off(eventName:string, handler:Function) {
        var events = [...this.eventsList];

        for (var i = this.eventsList.length; i >= 0; i--) {
            var event = this.eventsList[i];
            // TODO: find why sometimes there are undefined events
            if(!event) {
                events.splice(i, 1);
                continue;
            }
            if (event.name === eventName && event.handler === handler) {
                events.splice(i, 1);
                continue;
            } 
        }

        this.eventsList = events;
    };

    addEventListener = this.on;
    removeEventListener = this.off;

    dispatch(eventName:string, data?:any) {
        this.eventsList.forEach(e => {
            if (e.name === eventName) e.handler(data);
        });
    };
}