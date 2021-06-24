const { Server } = require("ws");

const wss = new Server({
    clientTracking: true,
    port: 1212
});

wss.on("connection", s => {
    s.on("message", data => {
        console.log(data.toString());
        if (data.startsWith("r")) s.send("Hello response test");
    });
});

setInterval(() => {
    wss.clients.forEach(c => c.send("Ping :-)"));
}, 5000);
