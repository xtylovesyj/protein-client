export default class WebSocketService {
    constructor(url, command, params) {
        this.commandToCallbacks = new Map();
        this.ws = new WebSocket(url);
        this.connected = false;
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                command: command ? command : 'init',
                data: 'init',
                user: sessionStorage.getItem('user'),
                params: params
            }));
            this.connected = true;
        }
        this.ws.onmessage = data => {
            if (!data || !data['data']) {
                return;
            }
            data = JSON.parse(data['data']);
            let command = data['command'];
            if (command) {
                this.commandToCallbacks.forEach((value, key) => {
                    if (key == command) {
                        value.forEach(callback => {
                            callback(data['data']);
                        });
                    }
                });
            }

        }
        this.ws.onclose = () => {
            console.log('websocket is closed');
        }

        this.ws.onerror = () => {
            console.log('websocket is error');
        }
    }
    addListener(command, callback) {
        if (this.commandToCallbacks.has(command)) {
            this.commandToCallbacks.get(command).set(callback);
        } else {
            this.commandToCallbacks.set(command, new Set().add(callback));
        }
    }

    close() {
        this.ws.close();
    }

    send(message) {
        let interval = null;
        interval = setInterval(() => {
            if (this.connected) {
                this.ws.send(JSON.stringify(message));
                clearInterval(interval);
            }
        }, 100);
    }

}