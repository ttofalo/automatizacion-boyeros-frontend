import { useEffect, useRef } from 'react';

const SOCKET_URL = 'ws://93.92.112.215:8000/ws/boyeros';

export const useBoyeroWebSocket = (onMessage) => {
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);
    const savedOnMessage = useRef(onMessage);

    // Keep the latest callback ref updated
    useEffect(() => {
        savedOnMessage.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        connect();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, []);

    const connect = () => {
        // Prevent multiple connections
        if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log('Attempting to connect to WebSocket:', SOCKET_URL);
        ws.current = new WebSocket(SOCKET_URL);

        ws.current.onopen = () => {
            console.log('✅ WebSocket Connected Successfully');
        };

        ws.current.onmessage = (event) => {
            try {
                console.log('📩 WebSocket Message:', event.data);
                const data = JSON.parse(event.data);
                if (savedOnMessage.current) {
                    savedOnMessage.current(data);
                }
            } catch (error) {
                console.error('❌ Error parsing WebSocket message:', error);
            }
        };

        ws.current.onclose = (event) => {
            console.warn('⚠️ WebSocket Disconnected used code:', event.code, 'reason:', event.reason);
            console.log('Reconnecting in 3 seconds...');
            reconnectTimeout.current = setTimeout(connect, 3000);
        };

        ws.current.onerror = (error) => {
            console.error('❌ WebSocket Error:', error);
            // Let onclose handle reconnection
        };
    };
};
