import type { Bingo, WebSocketMessage } from '~/types/bingo'
import { ref, onUnmounted } from 'vue'

const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const bingoState = ref<Bingo | null>(null)
let onSyncRequested: (() => void) | null = null

const connectionError = ref<string | null>(null)

let shouldReconnect = true;
let currentDelay = 500;
let connectionAttempt = 1;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

function retryDelay() {
    connectionAttempt += 1;
    currentDelay = currentDelay * 2;
    if (currentDelay > 10000) {
        currentDelay = 10000;
    }
    return currentDelay;
}

function resetDelay() {
    connectionAttempt = 1;
    currentDelay = 500;
}


export function useWebSocket() {

    function destroy() {
        shouldReconnect = false;
        if (reconnectTimeout != null)
            clearTimeout(reconnectTimeout);
        socket.value?.close();
    }

    onUnmounted(() => {
        destroy();
    })

    function connect(serverIP: string = window.location.hostname): void {
        if (socket.value?.readyState === WebSocket.OPEN) {
            return
        }

        shouldReconnect = true;
        socket.value = new WebSocket(`ws://${serverIP}:3001`)

        socket.value.onopen = () => {
            isConnected.value = true
            connectionError.value = null;
            resetDelay();

            console.log("WebSocket connected")
            requestSync()
        }

        socket.value.onmessage = (event: MessageEvent) => {
            console.log("Message received:", event.data)
            try {
                const data: WebSocketMessage = JSON.parse(event.data)

                if (data.type === "SYNC") {
                    bingoState.value = data.bingo ?? null
                }
                else if (data.type === "REQUEST_SYNC") {
                    if (onSyncRequested) {
                        onSyncRequested()
                    }
                }
            }
            catch (error) {
                return console.error(error);
            }
        }

        socket.value.onclose = () => {
            connectionError.value = `Disconnected, retrying ... (attempt ${connectionAttempt})`;
            isConnected.value = false
            console.log("WebSocket disconnected")

            if (shouldReconnect)
                reconnectTimeout = setTimeout(() => connect(serverIP), retryDelay())
        }

        socket.value.onerror = (error: Event) => {
            connectionError.value = "Connection failed";
            console.log("WebSocket error:", error)
        }
    }

    function send(data: WebSocketMessage): void {
        if (socket.value?.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        }
    }

    function syncBingo(bingo: Bingo): void {
        send({ type: "SYNC", bingo })
    }

    function requestSync(): void {
        send({ type: "REQUEST_SYNC" })
    }

    function onRequestSync(callback: () => void): void {
        onSyncRequested = callback
    }

    function disconnected(): void {
        socket.value?.close()
    }

    return {
        isConnected,
        bingoState,
        connectionError,
        connect,
        send,
        syncBingo,
        requestSync,
        onRequestSync,
        disconnected,
    }
}
