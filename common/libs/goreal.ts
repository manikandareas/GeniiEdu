export class Goreal {
    BASE_URL = 'http://localhost:7113';
    _userId: string = '';

    constructor(userId: string) {
        this._userId = userId;
    }

    async streamNotifications(callback: (data: string) => void) {
        // Initiate the first call to connect to SSE API
        const url = `${this.BASE_URL}/api/users/${this._userId}/notification-stream`;
        const apiResponse = await fetch(url, {
            method: 'GET',

            headers: {
                'Content-Type': 'text/event-stream',
                'x-user-id': this._userId,
            },
        });

        if (!apiResponse.body) return;

        // To decode incoming data as a string
        const reader = apiResponse.body
            .pipeThrough(new TextDecoderStream())
            .getReader();

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            if (value) {
                callback(value);
            }
        }
    }

    async pushBroadcast(request: BroadcastRequest): Promise<boolean> {
        const url = `${this.BASE_URL}/api/notifications/broadcast`;
        const response = await fetch(url, {
            headers: {
                'x-user-id': this._userId,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(request),
        });
        console.log({ response });

        return response.ok;
    }
}

type BroadcastRequest = {
    event: string;
    recipients: string[];
};
