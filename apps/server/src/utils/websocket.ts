import { validateJsonWebToken } from './crypto/jwt.utils';
import { Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';

export class WebSocketManager {
    private static instance: WebSocketManager;
    private wss: WebSocket.Server;
    private channels: Map<string, WebSocket>;

    private constructor(server: any) {
        this.wss = new WebSocketServer({ server, path: '/api/ws' });
        this.channels = new Map<string, WebSocket>();

        this.wss.on('connection', async (ws: WebSocket, req) => {
            const refresh = req.headers.cookie
                ?.split('refreshToken=')[1]
                .split(';')[0];
            if (!refresh) return;
            const { payload } = validateJsonWebToken(refresh as string);

            if (!payload) return;
            const channelId = payload.sessionId;
            this.channels.set(channelId, ws);
            console.log(`Client assigned to channel: ${channelId}`);

            ws.on('message', (message: string) => {
                const data = JSON.parse(message);
                const { action } = data;

                switch (action) {
                    case 'join':
                        this.joinChannel(channelId, ws);
                        break;
                    default:
                        console.log(`Unknown action: ${action}`);
                }
            });

            ws.on('close', () => {
                this.channels.delete(channelId);
                console.log(`Client left channel: ${channelId}`);
            });
        });
    }

    static getInstance(server: any): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager(server);
        }
        return WebSocketManager.instance;
    }

    private joinChannel(channel: string, ws: WebSocket) {
        if (this.channels.has(channel)) {
            console.log(`Channel ${channel} already has a member.`);
            return;
        }

        this.channels.set(channel, ws);
        console.log(`Client joined channel: ${channel}`);
    }

    broadcast(channel: string, data: Record<string, any>) {
        console.log(`recieved channel: ${channel}`);
        const ws = this.channels.get(channel);
        if (!ws) {
            console.log(`Channel ${channel} does not exist.`);
            return;
        }

        ws.send(JSON.stringify(data));
    }
}
// Create a singleton instance of WebSocketManager

export const initWebSocketManager = function (server: Server) {
    return WebSocketManager.getInstance(server);
};
