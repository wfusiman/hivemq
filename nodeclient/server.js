// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const port = 3300;

import MqttHandler from './mqttHandler.js';
var mqttClient = new MqttHandler();

app.use( cors( { origin:'*'}));
app.use( bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true }))


app.get('/', (req, res) => {
    console.log("connect /");
    mqttClient.connect();
    res.send('Hello, Docker! connect to mqtt ');
});

// Routes

app.get('/api/stat', async(req,res) => {
    console.log("*** STATUS ");
    var stat = mqttClient.getStatConnection();
    res.send( { error: false, data:  stat } );
});

app.get( '/api/connect', async(req,res) => {
    console.log("*** CONNECT ");
    mqttClient.connect();
    var stat = mqttClient.getStatConnection();
    res.send( { error: false, data:  stat } );
});

app.post("/api/publish", async(req, res) => {
    console.log("publish req body: ", req.body)
    var stat = mqttClient.publishMessage(req.body.topic, req.body.message);
    res.send( { error: !stat, data: stat ? 'Mensaje publicado':'No se pudo publicar'} );
});

app.post('/api/subscribe', (req,res) => {
    console.log("subscribe req body: ", req.body)
    var stat = mqttClient.subscribeTopic(req.body.topic, req.body.qos);
    res.send( { error: !stat, data: stat ? 'Subscripto a tema ' + req.body.topic: 'No se pudo subscribir a tema ' + req.body.topic });
});

app.put('/api/desubscribe', (req,res) => {
    console.log("desubscribe req body: ", req.body)
    var stat = mqttClient.desubscribeTopic(req.body.topic);
    res.send( { error: !stat, data: stat ? 'desubscripto a tema ' + req.body.topic: 'No se pudo desubscribir a tema ' + req.body.topic });
});

app.get( '/api/messages', (req,res) => {
    console.log("*** MESSAGES ");
    var msgs = mqttClient.getMessages();
    res.send( { error: false, data: msgs });
});

app.delete( '/api/disconnect', (req,res) => {
    console.log("*** DISCONNECT ");
    mqttClient.disconnect();
    res.send( { error: false, data: 'desconectado' });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});