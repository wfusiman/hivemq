//const mqtt = require('mqtt');
import mqtt from 'mqtt';

var messages;
var topics;

class MqttHandler {

  mqttClient = null;
  host = 'mqtt://192.168.0.113:1883';
  ws = 'ws://192.168.0.113:8000';

  optionConn = {
    clientId: '',
    clean: true,
    //connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
  }

  constructor() {
    messages = [];
    topics = [];
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, /* optionConn */);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log('*** MQTT  ', err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log('mqtt client connected: ', this.mqttClient);
      messages = [];
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log("recibiendo mensaje", message.toString());
      if (!messages)
        messages = []
      messages.push({ topic: topic, message: message.toString() });
      console.log("agregando mensajes al arreglo: ", messages);
    });
  }

  getStatConnection() {
    if (this.mqttClient && this.mqttClient.connected) {
      return { connect: true, value: 'Conectado', topics: topics };
    }
    return { connect: false, value: 'No conectado' };
  }

  // Sends a mqtt message to topic: mytopic
  publishMessage(topic, message) {
    if (this.mqttClient && !this.mqttClient.disconnect) {
      this.mqttClient.publish(topic, message);
      return true;
    }
    return false;
  }

  subscribeTopic(topic, qos) {
    // mqtt subscriptions
    if (this.mqttClient && !this.mqttClient.disconnect) {
      this.mqttClient.subscribe(topic, { qos: qos ? qos : 0 });
      topics.push( topic );
      return true;
    }
    return false;
  }

  desubscribeTopic(topic) {
    // mqtt desubscriptions
    if (this.mqttClient && !this.mqttClient.disconnect) {
      this.mqttClient.unsubscribe(topic);
      topics = topics.filter( t => t!= topic );
      return true;
    }
    return false;
  }

  getMessages() {
    console.log("getMessages: ", messages);
    return messages.reduce((acc, val) => [val, ...acc], []);
  }

  disconnect() {
    if (this.mqttClient && !this.mqttClient.disconnect) {
      this.mqttClient.end();
      messages = [];
      topics = [];
    }
    return true;
  }

}

export default MqttHandler