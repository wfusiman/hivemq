import logging
import paho.mqtt.client as mqtt
from flask import current_app # type: ignore

messagesList = []
topicsList = []
mqttclient = mqtt.Client(client_id='pahoClient')
logger = logging.getLogger(__name__)

class MqttController:   
    host = '192.168.0.113'
    port = 1883
    keepAlive = 50;
    
    def __init__(self, keepAlive=50):
        keepAlive = keepAlive

    def on_connect(client, userdata, flags, rc):
        logger.info('CONNACK received with code %d.' % (rc))
        #current_app.logger.info('CONNACK received with code %d.' % (rc))
    
    mqttclient.on_connect = on_connect
    mqttclient.will_set('die', payload='Mensaje final', qos=0, retain=False)
    
    def status(self):
        current_app.logger.info('*** STATUC CONECCTION ' + str(mqttclient) )
        if (mqttclient.is_connected()):
            return { "connect":True, "value":"Conectado", "topics": str( topicsList )}
        return { "connect":False, "value":"No Conectado" }

    def connect(self):
        val = mqttclient.connect( self.host,self.port,self.keepAlive )
        current_app.logger.info( val )
        mqttclient.loop_start()

    def publish(self, topic, message):
        if (mqttclient.is_connected()):
            val = mqttclient.publish( topic, message )
            return val
        return False

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        logger.info('RECEIVE MESSAGE: ' + str( msg.payload.decode('utf8')) )
        nmessage = {"topic": msg.topic, "message": str(msg.payload.decode('utf8')) }
        messagesList.append( nmessage )

    def subscribe( self,topic,qos = 0 ):
        if (mqttclient.is_connected()):
            mqttclient.subscribe( topic, qos )
            topicsList.append( topic )
            mqttclient.on_message = self.on_message
            return True
        return False

    def desubscribe( self,topic ):
        if (mqttclient.is_connected()):
            mqttclient.unsubscribe( topic )
            return True
        return False

    def disconnect(self):
        if (mqttclient.is_connected()):
            mqttclient.disconnect()
            mqttclient.loop_stop()

    def getMessages(self ):
        reversed_list = messagesList[::-1]
        return reversed_list

    def getTopics(self):
        return topicsList
