const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const bodyParser = require('body-parser')

const app = express();
const port = 3001;
const socketServer = new WebSocket.Server({port: 3030});

const messages = [];

app.use(bodyParser.urlencoded({extended: false})) 
app.use(bodyParser.json()) 
app.use("/static", express.static('./static/'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/', function (req, res) {
    var group = req.body.group;
    var name = req.body.name;
    var priority = req.body.priority;
    var message = req.body.message;
    var time = req.body.time;

    const latency = Date.now() - time;

    const string = "Callback from:\n\t" + group + "/" + name + "\nPriority:\n\t" + priority + "\nMessage:\n\t" + message + "\nTime:\n\t" + time + "\nLatency:\n\t" + latency + "ms"
    res.send(string);

    messages.push(string);

    socketServer.clients.forEach((client) => { // Push to each client
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify([string]));
          console.log(JSON.stringify([string]));
        }
    });
})

function returnBox() {
  return {
    pose: {
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      position: { x: 0, y: 0, z: 0 },
    },
    scale: { x: 15, y: 15, z: 15 },
    color: { r: 1, g: 0, b: 1, a: 0.9 },
  }
}

let box = {
  id: "010",
  name: "BOX",
  pose: {
    orientation: { x: 0, y: 0, z: 0, w: 1 },
    position: { x: -5, y: 0, z: 0 },
  },
  scale: { x: 15, y: 15, z: 15 },
    color: { r: 0, g: 1, b: 1, a: 0.8 },
}

let box2 = {
  id: "010",
  name: "BOX1",
  pose: {
    orientation: { x: 0, y: 0, z: 0, w: 1 },
    position: { x: 10, y: 0, z: 0 },
  },
  scale: { x: 15, y: 15, z: 15 },
    color: { r: 0, g: 1, b: 1, a: 0.8 },
}

let box3 = {
  id: "011",
  name: "BOX2",
  pose: {
    orientation: { x: 0, y: 0, z: 0, w: 1 },
    position: { x: -5, y: 0, z: 0 },
  },
  scale: { x: 15, y: 15, z: 15 },
    color: { r: 0, g: 1, b: 1, a: 0.8 },
}

let box4 = {
  id: "010",
  name: "BOX1",
  pose: {
    orientation: { x: 0, y: 0, z: 0, w: 1 },
    position: { x: 0, y: 20, z: 0 },
  },
  scale: { x: 15, y: 15, z: 15 },
    color: { r: 0, g: 1, b: 1, a: 0.8 },
}

socketServer.on('connection', (socketClient) => {
    console.log('connected');
    console.log('Number of clients: ', socketServer.clients.size);
    socketClient.send( JSON.stringify(box) );
    setTimeout(function(){
      socketClient.send( JSON.stringify(box2) );
    }, 2000);
    setTimeout(function(){
      socketClient.send( JSON.stringify(box3) );
    }, 4000);
    setTimeout(function(){
      socketClient.send( JSON.stringify(box4) );
    }, 6000);

    socketClient.on('close', (socketClient) => {
      console.log('closed');
      console.log('Number of clients: ', socketServer.clients.size);
    });
});