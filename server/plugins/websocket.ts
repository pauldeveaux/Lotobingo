
import { WebSocketServer, WebSocket } from "ws";


let wss: WebSocketServer;

export default defineNitroPlugin((nitro) => {
    wss = new WebSocketServer({ port: 3001, host: "0.0.0.0" })

    wss.on("connection", (ws: WebSocket) => {
        console.log("Client connected");


        ws.on("message", (data) => {
            // When admin sends a message, broadcast to all OTHER clients    
            console.log("Server received:", data.toString());                                                                                                                       
            const message = data.toString();
            console.log("Broadcasting to", wss.clients.size - 1, "clients");
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    console.log("Sending to client");
                    client.send(message);
                }
            });
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });
    })

    
    // Cleanup on server shutdown                                                                                                                                                               
    nitro.hooks.hook("close", () => {                                                                                                                                                           
      wss.close();                                                                                                                                                                              
    });                                                                                                                                                                                         
})

export { wss };                                                                                                                                                                               