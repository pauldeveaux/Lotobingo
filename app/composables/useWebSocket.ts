import type { Bingo, Prize, Sponsor, WebSocketMessage } from '~/types/bingo'
import type { ClientStyle } from '~/stores/useClientStyleStore'
import { ref } from 'vue'

const socket = ref<WebSocket | null>(null)
const isConnected = ref(false)
const bingoState = ref<Bingo | null>(null)
const lotoName = ref<string>('')
const lotoSubtitle = ref<string>('')
const lotoLogo = ref<string | null>(null)
const prizeState = ref<Prize | null>(null)
const sponsorState = ref<Sponsor | null>(null)
const clientStyleState = ref<ClientStyle | null>(null)
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

    // Note: Don't call destroy() on unmount since this is a singleton
    // The WebSocket should stay open while the app is running

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
                    const previousBingoId = bingoState.value?.id
                    bingoState.value = data.bingo ?? null

                    if (data.lotoName !== undefined) {
                        lotoName.value = data.lotoName
                    }
                    if (data.lotoSubtitle !== undefined) {
                        lotoSubtitle.value = data.lotoSubtitle
                    }
                    if (data.lotoLogo !== undefined) {
                        lotoLogo.value = data.lotoLogo
                    }

                    // If bingo changed, clear prize (will be updated if new bingo has one)
                    if (data.bingo?.id !== previousBingoId) {
                        prizeState.value = null
                    }
                    // Update prize if provided
                    if (data.prize) {
                        prizeState.value = data.prize
                    }
                    // Update sponsor if provided
                    if (data.sponsor !== undefined) {
                        sponsorState.value = data.sponsor ?? null
                    }
                }
                else if (data.type === "SYNC_PRIZE") {
                    prizeState.value = data.prize ?? null
                }
                else if (data.type === "SYNC_SPONSOR") {
                    sponsorState.value = data.sponsor ?? null
                }
                else if (data.type === "SYNC_STYLE") {
                    if (data.clientStyle) {
                        clientStyleState.value = data.clientStyle as ClientStyle
                    }
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
            const message = JSON.stringify(data)
            console.log("WebSocket sending:", message)
            socket.value.send(message)
        }
    }

    function syncBingo(bingo: Bingo, options?: { prize?: Prize | null, lotoName?: string, lotoSubtitle?: string, lotoLogo?: string | null }): void {
        const message: WebSocketMessage = { type: "SYNC", bingo }
        if (options?.lotoName !== undefined) message.lotoName = options.lotoName
        if (options?.lotoSubtitle !== undefined) message.lotoSubtitle = options.lotoSubtitle
        if (options?.lotoLogo !== undefined) message.lotoLogo = options.lotoLogo
        if (options?.prize) message.prize = options.prize
        send(message)
    }

    function syncPrize(prize: Prize | null): void {
        send({ type: "SYNC_PRIZE", prize })
    }

    function syncSponsor(sponsor: Sponsor | null): void {
        send({ type: "SYNC_SPONSOR", sponsor })
    }

    function syncStyle(style: ClientStyle): void {
        clientStyleState.value = style
        send({ type: "SYNC_STYLE", clientStyle: style as unknown as Record<string, unknown> })
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
        lotoName,
        lotoSubtitle,
        lotoLogo,
        prizeState,
        sponsorState,
        clientStyleState,
        connectionError,
        connect,
        send,
        syncBingo,
        syncPrize,
        syncSponsor,
        syncStyle,
        requestSync,
        onRequestSync,
        disconnected,
        retryDelay,
        resetDelay
    }
}
