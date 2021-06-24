const el = (id) => document.querySelector(id);
EventTarget.prototype.on = EventTarget.prototype.addEventListener;
let websocket = null;
const elements = {
    messageContainer: el("#message_container"),
    tableHeader: el("thead"),
    tableContent: el("tbody"),
    messageInput: el("#message_input_field"),
    disconnectButton: el("#disconnect"),
    connectOverlay: el("#connect_layover"),
    connectForm: el("#connect_layover form"),
    connectWebsocketUrl: el("#websocket_connection"),
    connectWebsocketHeader: el("#websocket_connection_header"),
    connectError: el("#connect_error"),
    connectButton: el("#connect")
};
elements.connectForm.on("submit", e => {
    e.preventDefault();
    elements.connectWebsocketUrl.disabled = true;
    elements.connectWebsocketHeader.disabled = true;
    elements.connectButton.disabled = true;
    elements.connectButton.innerText = "Connecting...";
    connectToWebsocket(elements.connectWebsocketUrl.value, elements.connectWebsocketHeader.value).then(success => {
        console.log(success);
        if (success) {
            resetOverlay();
            elements.connectOverlay.style.display = "none";
            startWebsocket();
        }
        else {
            resetOverlay();
            elements.connectError.style.display = "block";
        }
    });
    return false;
});
elements.disconnectButton.on("click", () => {
    websocket.close(1000);
});
function resetOverlay() {
    elements.connectError.style.display = "none";
    elements.connectWebsocketUrl.disabled = false;
    elements.connectWebsocketHeader.disabled = false;
    elements.connectButton.disabled = false;
    elements.connectButton.innerText = "Connect";
}
function connectToWebsocket(url, header) {
    return new Promise(resolve => {
        const parsedUrl = url.match(/^(?:(?<protocol>[a-zA-Z]+):\/\/)?(.*)$/);
        const newUrl = parsedUrl.groups.protocol == "ws" || parsedUrl.groups.protocol == "wss" ? url : "ws://" + parsedUrl[2];
        let ws;
        try {
            ws = new WebSocket(newUrl, header || undefined);
        }
        catch (e) {
            resolve(false);
        }
        const onerror = () => {
            resolve(false);
            ws.removeEventListener("error", onerror);
            ws.removeEventListener("open", onopen);
        };
        const onopen = () => {
            websocket = ws;
            resolve(true);
            ws.removeEventListener("error", onerror);
            ws.removeEventListener("open", onopen);
        };
        ws.on("error", onerror);
        ws.on("open", onopen);
    });
}
// elements.messageContainer.on("scroll", () => {
//     const scroll = elements.messageContainer.scrollTop;
//     elements.tableHeader.style.transform = `translateY(${scroll}px)`;
// });
elements.messageInput.on("keydown", (e) => {
    if (e.key == "Enter") {
        websocket.send(elements.messageInput.value);
        onMessage(elements.messageInput.value, "message_out");
        elements.messageInput.value = "";
    }
});
function onMessage(content, className) {
    const date = now();
    const tr = document.createElement("tr");
    tr.className = className;
    tr.appendChild(document.createElement("td")).appendChild(document.createTextNode(content));
    tr.appendChild(document.createElement("td")).appendChild(document.createTextNode(date));
    elements.tableContent.appendChild(tr);
    elements.messageContainer.scrollTo(0, elements.messageContainer.scrollHeight);
}
function startWebsocket() {
    onMessage("Connected to WebSocket at " + websocket.url, "message_connected");
    elements.messageInput.focus();
    websocket.onmessage = e => {
        onMessage(e.data, "message_in");
    };
    websocket.onclose = e => {
        onMessage(`Connection with ${websocket.url} closed. Code: ${e.code}`, "message_closed");
        elements.connectOverlay.style.display = "block";
        elements.connectWebsocketUrl.focus();
        websocket = null;
    };
}
function now() {
    const date = new Date();
    const dateHours = ("00" + date.getHours()).slice(-2);
    const dateMinutes = ("00" + date.getMinutes()).slice(-2);
    const dateSeconds = ("00" + date.getSeconds()).slice(-2);
    return `${dateHours}.${dateMinutes}.${dateSeconds}`;
}
//# sourceMappingURL=websocket.js.map