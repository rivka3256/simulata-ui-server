import amqplib, { type Connection, type Channel } from 'amqplib';
import { RABBITMQ_CONFIG, EXCHANGE, QUEUES } from './config.js';

// ─── Singleton state ──────────────────────────────────────────────────────────

let connection: Connection | any;
let channel: Channel | any;
let isConnecting = false;

// ─── Setup: declare exchange + queue + binding ────────────────────────────────

async function setupTopology(ch: Channel): Promise<void> {
  await ch.assertExchange(EXCHANGE.name, EXCHANGE.type, EXCHANGE.options);

  for (const queue of Object.values(QUEUES)) {
    await ch.assertQueue(queue.name, queue.options);
    await ch.bindQueue(queue.name, EXCHANGE.name, queue.routingKey);
  }
}

// ─── Connect ─────────────────────────────────────────────────────────────────

export async function connect(): Promise<void> {
  if (channel || isConnecting) return;
  isConnecting = true;

  try {
    // console.log('[RabbitMQ] Connecting to', RABBITMQ_CONFIG.url);
    connection = await amqplib.connect(RABBITMQ_CONFIG.url);
    channel = await connection.createConfirmChannel();

    await setupTopology(channel);

    connection.on('error', (err: Error) => {
      console.error('[RabbitMQ] Connection error:', err.message);
      scheduleReconnect();
    });

    connection.on('close', () => {
      console.warn('[RabbitMQ] Connection closed — reconnecting...');
      scheduleReconnect();
    });

    console.log('[RabbitMQ] Connected and topology ready');
  } catch (err: any) {
    // console.error('[RabbitMQ] Failed to connect:', err.message);
    scheduleReconnect();
  } finally {
    isConnecting = false;
  }
}

function scheduleReconnect(): void {
  connection = null;
  channel = null;
  setTimeout(connect, RABBITMQ_CONFIG.reconnectDelayMs);
}

// ─── Getters ──────────────────────────────────────────────────────────────────

export function getChannel(): Channel {
  if (!channel) throw new Error('[RabbitMQ] Channel not available — not connected yet');
  return channel;
}

export async function disconnect(): Promise<void> {
  try {
    await channel?.close();
    await connection?.close();
  } catch { /* ignore on shutdown */ }
  channel = null;
  connection = null;
}