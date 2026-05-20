export const RABBITMQ_CONFIG = {
  url: process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
  reconnectDelayMs: 5000,
} as const;

// Exchange: one direct exchange for all simulation commands
export const EXCHANGE = {
  name: 'simulata.exchange',
  type: 'topic',
  options: { durable: true },
} as const;

// Queue consumed by the Python service
export const QUEUES = {
  generator_queue: {
    name: 'generator_queue',
    routingKey: 'generator_queue_key',
    options: { durable: true },
  },
} as const;
