const Kafka = require('node-rdkafka');
const config = require('../../config/config');

// Const KAFKA_BROKER = 'localhost:9092';
const KAFKA_BROKER = `${config.kafka.host}:${config.kafka.port}`;
const KAFKA_TOPIC = 'events';

let producer;

const connectToKafka = () => {
    producer = new Kafka.Producer({
        'metadata.broker.list': KAFKA_BROKER,
    });
    producer.connect();
};

const emitEvent = (event, data) => {
    if (!producer) {
        connectToKafka();
    }

    const message = JSON.stringify({event, data});
    producer.produce(KAFKA_TOPIC, null, Buffer.from(message));
};

module.exports = {
    connectToKafka,
    emitEvent,
};
