class EventBus<DetailType = any> {
    private eventTarget: EventTarget;
    private listeners: any = {};

    on(type: string, listener: (event: any) => void) {
        // this.eventTarget.addEventListener(type, listener);
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    }

    // once(type: string, listener: (event: CustomEvent<DetailType>) => void) {
    //     this.eventTarget.addEventListener(type, listener, { once: true });
    //     this.listeners[type].push(listene)
    // }

    // off(type: string, listener: (event: CustomEvent<DetailType>) => void) {
    //     // this.eventTarget.removeEventListener(type, listener);
    //     this.listeners[type].delete(listener);
    // }
    //
    emit(type: string, detail?: DetailType) {
        if (!this.listeners[type]) {
            return;
        }
        this.listeners[type].forEach(function (listener) {
            listener(detail);
        });
    }
}

export default new EventBus();
