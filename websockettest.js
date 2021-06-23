var wsUri;
var websocket;
const wsUriField = document.getElementById("url");
const output = document.getElementById("output");
const messageField = document.getElementById('message');
const message = document.getElementById("message");
message.addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
        event.preventDefault();
        document.getElementById("send").click();
    }
});

function connect() {
    wsUri = wsUriField.value;
    write("orange", "CONNECTING TO " + wsUri + "...");
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };
}

function disconnect() {
    if (websocket != undefined && websocket.readyState == 1) {
        write("orange", "DISCONNECTING...");
        websocket.close();
    } else {
        write("red", "NOT CONNECTED!");
    }
}

function onOpen(evt) {
    write("green", "CONNECTED TO " + wsUri)
}

function onClose(evt) {
    const reason = (evt.reason != undefined && evt.reason != "") ? "MESSAGE: " + evt.reason + " " : "";
    write("red", `DISCONNECTED. ${reason}CODE: ${evt.code}`);
}

function onMessage(evt) {
    write("blue", "RESPONSE: " + evt.data);
}

function onError(evt) {
    write("red", "ERROR: " + evt.data);
}

function doSend(message) {
    if (websocket != undefined && websocket.readyState == 1) {
        write("black", "SENT: " + message);
        websocket.send(message);
    } else {
        write("red", "NOT CONNECTED!");
    }
}

function write(color, message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = `<span style="color: ${color};">${message}`;
    output.appendChild(pre);
}

function sendButtonClicked() {
    const value = messageField.value;
    if (value == "disconnect") {
        websocket.close();
    } else if (value == "connect") {
        init();
    } else {
        doSend(value);
    }
}