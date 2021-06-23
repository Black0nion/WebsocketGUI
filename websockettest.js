var wsUri = "ws://tet";
var output;

function init() {
    output = document.getElementById("output");
    writeToScreen('<span style="color: orange;">CONNECTING TO ' + wsUri);
    testWebSocket();
}

function testWebSocket() {
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };
}

function onOpen(evt) {
    writeToScreen('<span style="color: green;">CONNECTED TO ' + wsUri + "</span>");
}

function onClose(evt) {
    writeToScreen('<span style="color: red;">DISCONNECTED. MESSAGE: ' + evt.reason + " CODE: " + evt.code + "</span>");
}

function onMessage(evt) {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
    //websocket.close();
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR: </span> ' + evt.data);
}

function doSend(message) {
    if (websocket.readyState == 1) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    } else {
        writeToScreen('<span style="color: red;">NOT CONNECTED!</span>');
    }
}

function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

window.addEventListener("load", init, false);

function sendButtonClicked() {
    const value = document.getElementById('message').value;
    if (value == "disconnect") {
        websocket.close();
    } else if (value == "connect") {
        init();
    } else {
        doSend(value);
    }
}