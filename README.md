![PRs Welcome](https://img.shields.io/badge/PRs-very%20welcome-brightgreen.svg)
# WebSocketGUI
This is a simple GUI to test Websockets.

## Hosted
This repo contains the source of the WebsocketGUI. If you don't want to host your own server (for example to be able to access local websockets), you can use [our hosted site](https://black0nion.github.io/WebsocketGUI/).

## Setup
*NOTE: The website needs to be hosted on a webserver. It doesn't work when you open it as a file because of CORS errors (if someone knows how to fix them, please open a PR). Described here are some ways to easily host the GUI on a Webserver. More instructions may follow.*
### Live Server
*Live Server* is a Extension for Visual Studio Code providing you with many features like live reload.
1. Open the Repo in Visual Studio Code
2. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Press `Ctrl + Shift + P` to open the command palette, type in `Open with Live Server` and press enter
4. Your browser should start automatically
5. You may see a overview of files. Click on `index.html` to open the GUI
6. Start using the WebSocketGUI! (For more instructions see [How to use WebSocketGUI](#how-to-use-websocketgui))

## How to use WebSocketGUI
*If you have any questions regarding this software, feel free to contact me on Discord: \_SIM\_#6866*
1. Type in your WebSocket URL including the protocol (ws or wss) into the URL field (Example: `ws://localhost:1337`)
2. Press `Connect`
3. Wait for the connection to establish (it should print **CONNECTED TO \<url\>**)
4. Type in the message to send into the `Message to send` field and press `SEND`
5. Answers from the WebSocket server get printed to the screen.

*DISCLAIMER: You are responsible for what you do with this program. Neither me or BlackOnion take responsibility for any damage or any other problems you might encounter by using this program. Example: if you get hacked using this program, the one who attacked you is responsible, not me or BlackOnion.*
