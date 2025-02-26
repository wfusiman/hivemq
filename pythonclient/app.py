import json
import logging

from flask import Flask,request,jsonify # type: ignore
from flask_cors import CORS # type: ignore
from mqttController import MqttController

app = Flask(__name__)
CORS(app)
mqttCtrl = MqttController() # type: ignore

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker</h2>'

@app.route('/api/status', methods=['GET'])
def getStatus():
    stat = mqttCtrl.status()
    #resp = { "error": False, "connect": val, "value": "Conectado" if val else "No conectado" } 
    return jsonify( stat )

@app.route('/api/connect', methods=['GET'])
def connectBroker():
    app.logger.debug("**** CONNECT")
    mqttCtrl.connect()
    app.logger.debug("**** AFTER CONNECT")
    return jsonify( {"error": False, "data": "Conectado"} )

@app.route('/api/publish', methods=['POST'])
def publish():
    data = request.get_json()
    topic = data.get('topic')
    message = data.get('message')
    retain = data.get('retain')
    app.logger.debug("***** PUBLISH: " + str(data ))
    val = mqttCtrl.publish( topic, message, retain )
    return jsonify( {"error": True if val==False else False, "data": str(val)} )

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    topic = data.get('topic')
    qos = data.get('qos')
    app.logger.debug("***** SUBSCRIBE: " + str(data ))
    val = mqttCtrl.subscribe( topic, qos )
    return jsonify( { "error": False if val else True, "data": "Susbcripto" if val else "No se pudo subscribir"} )


@app.route('/api/desubscribe', methods=['PUT'])
def desubscribe():
    data = request.get_json()
    topic = data.get('topic')
    app.logger.debug("***** DESUBSCRIBE: " + str(data ))
    val = mqttCtrl.desubscribe( topic )
    return jsonify( { "error": False if val else True, "data": "Desusbcripto" if val else "No se pudo desubscribir"} )


@app.route('/api/disconnect', methods=['DELETE'])
def disconnect():
    app.logger.debug("***** DISCONNECT: ")
    mqttCtrl.disconnect()
    return jsonify( { "error": False, "data": "Desconectado"} )


@app.route('/api/messages', methods=['GET'])
def messages():
    app.logger.debug("***** MESSAGES: " )
    msgs = mqttCtrl.getMessages()
    app.logger.debug("***** RECUPERADOS MESSAGES: " + str(msgs) )
    return jsonify( { "error": False, "data": str(msgs) } )


if __name__ == "__main__":
    app.run(debug=True)