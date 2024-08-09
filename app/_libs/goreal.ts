export class Goreal {
    BASE_URL = 'http://localhost:7113';
    _userId: string = '';

    constructor(userId: string) {
        this._userId = userId;
    }

    async streamNotifications(callback: (data: string) => void) {
        const url = `${this.BASE_URL}/api/users/${this._userId}/notification-stream`;

        while (true) {
            try {
                const apiResponse = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'x-user-id': this._userId,
                    },
                });

                if (!apiResponse.body) {
                    throw new Error('No response body');
                }

                const reader = apiResponse.body
                    .pipeThrough(new TextDecoderStream())
                    .getReader();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log('Stream closed');
                        break;
                    }
                    if (value) {
                        callback(value);
                    }
                }
            } catch (error) {
                console.error('Error in SSE stream:', error);
                // Retry after 5 seconds
                await new Promise((resolve) => setTimeout(resolve, 5000));
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

    static broadcastKey = {
        NOTIFICATION_UPDATED: 'notification-updated',
    };
}

type BroadcastRequest = {
    event: string;
    recipients: string[];
};
