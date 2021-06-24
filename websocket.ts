
const el = <T extends HTMLElement = HTMLDivElement>(id: string): T => document.querySelector(id) as T;

interface EventTarget {
    on: EventTarget["addEventListener"]
}
EventTarget.prototype.on = EventTarget.prototype.addEventListener;

let websocket: WebSocket = null;

const elements = {
    messageContainer: el("#message_container"),
    tableHeader: el("thead"),
    tableContent: el("tbody"),
    messageInput: el<HTMLInputElement>("#message_input_field"),

    disconnectButton: el("#disconnect"),

    connectOverlay: el("#connect_layover"),
    connectForm: el<HTMLFormElement>("#connect_layover form"),
    connectWebsocketUrl: el<HTMLInputElement>("#websocket_connection"),
    connectWebsocketHeader: el<HTMLInputElement>("#websocket_connection_header"),
    connectError: el("#connect_error"),
    connectButton: el<HTMLButtonElement>("#connect")
}

elements.connectForm.on("submit", e => {
    e.preventDefault();
    elements.connectWebsocketUrl.disabled = true;
    elements.connectWebsocketHeader.disabled = true;
    elements.connectButton.disabled = true;
    elements.connectButton.innerText = "Connecting...";
    connectToWebsocket(elements.connectWebsocketUrl.value, elements.connectWebsocketHeader.value).then(success => {
        console.log(success);
        if (success) {
            elements.connectOverlay.style.display = "none";
            resetOverlay();
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
    websocket = null;
});

function resetOverlay() {
    elements.connectError.style.display = "none";
    elements.connectWebsocketUrl.disabled = false;
    elements.connectWebsocketHeader.disabled = false;
    elements.connectButton.disabled = false;
    elements.connectButton.innerText = "Connect";
}

function connectToWebsocket(url: string, header: string) {
    return new Promise<boolean>(resolve => {
        const parsedUrl = url.match(/^(?:(?<protocol>[a-zA-Z]+):\/\/)?(.*)$/);
        const newUrl = parsedUrl.groups.protocol == "ws" || parsedUrl.groups.protocol == "wss" ? url : "ws://" + parsedUrl[2];

        let ws: WebSocket;
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

elements.messageInput.on("keydown", (e: KeyboardEvent) => {
    if (e.keyCode == 13) {
        websocket.send(elements.messageInput.value);
        onMessage(elements.messageInput.value, false);
        elements.messageInput.value = "";
    }
});

function onMessage(content: string, incomming: boolean) {
    const date = now();
    const tr = document.createElement("tr");
    tr.className = incomming ? "message_in" : "message_out";
    tr.appendChild(document.createElement("td")).appendChild(document.createTextNode(content));
    tr.appendChild(document.createElement("td")).appendChild(document.createTextNode(date));
    elements.tableContent.appendChild(tr);
}

function startWebsocket() {
    const date = now();
    const tr = document.createElement("tr");
    tr.className = "message_connected";
    tr.appendChild(document.createElement("td")).appendChild(document.createTextNode("Connected to WebSocket"));
    tr.appendChild(document.createElement("td")).appendChild(document.createTextNode(date));
    elements.tableContent.appendChild(tr);
    elements.messageInput.focus();

    websocket.onmessage = e => {
        onMessage(e.data, true);
    };
    websocket.onclose = () => {
        elements.tableContent.innerHTML = "";
        elements.connectOverlay.style.display = "block";
    };
}


function now() {
    const date = new Date();
    const dateHours = ("00" + date.getHours()).slice(-2);
    const dateMinutes = ("00" + date.getMinutes()).slice(-2);
    const dateSeconds = ("00" + date.getSeconds()).slice(-2);
    return `${dateHours}.${dateMinutes}.${dateSeconds}`;
}
