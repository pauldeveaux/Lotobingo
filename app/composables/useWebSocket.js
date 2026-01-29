const socket = ref(null);
const isConnected = ref(false);
const bingoState = ref(null);
let onSyncRequested = null;

export function useWebSocket() {


    function connect(serverIP = window.location.hostname) {
        if (socket.value?.readyState === WebSocket.OPEN) {                                                                                                                       
            return;                                                                                                                                                                
        }

        socket.value = new WebSocket(`ws://${serverIP}:3001`);

        socket.value.onopen = () => {
            isConnected.value = true;
            console.log("WebSocket connected");
            requestSync();
        };

        socket.value.onmessage = (event) => {
            console.log("Message received:", event.data);
            const data = JSON.parse(event.data);

            if (data.type === "SYNC") {
                bingoState.value = data.bingo;
            }
            else if (data.type === "REQUEST_SYNC") {
                if (onSyncRequested) {
                    onSyncRequested();
                }
            }
        };

        socket.value.onclose = () => {
            isConnected.value = false;
            console.log("WebSocket disconnected");
            setTimeout(() => connect(serverIP), 2000);
        };

        socket.value.onerror = (error) => {
            console.log("WebSocket error:", error);
        };
    }

    function send(data) {
        if(socket.value?.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data));
        }
    }

    function syncBingo(bingo) {
        send({ type: "SYNC", bingo })
    }

    function requestSync(callback) {
        send({ type: "REQUEST_SYNC" })
    }

    function onRequestSync(callback) {
        onSyncRequested = callback;
    }

    function disconnected() {
        socket.value?.close();
    }

    return {
        isConnected,
        bingoState,
        connect,
        send,
        syncBingo,
        requestSync, 
        onRequestSync,
        disconnected,
    }
}