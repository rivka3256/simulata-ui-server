import amqplib from 'amqplib';
import { getChannel } from './connection.js';
import { EXCHANGE, QUEUES } from './config.js';
import { buildSimulationRunMessage } from './builders/simulationBuilder.js';
import { BaseRabbitMessage, SimulationRunPayload } from '../rabbitmq/types.js';

// מנוע שליחה גנרי לחלוטין לכל סוג הודעה עתידית במערכת
export async function publishMessage<T>(routingKey: string, messageBody: BaseRabbitMessage<T>): Promise<BaseRabbitMessage<T>> {
  const channel = getChannel() as amqplib.ConfirmChannel; // המרה בטוחה לערוץ מאובטח
  const payload = Buffer.from(JSON.stringify(messageBody));

  return new Promise((resolve, reject) => {
    channel.publish(
      EXCHANGE.name,
      routingKey,
      payload,
      {
        persistent: true, // ההודעה נשמרת פיזית בדיסק של השרת
        contentType: 'application/json',
        messageId: messageBody.message_id,
        timestamp: Date.now(),
      },
      (err: any) => {
        if (err) {
          console.error(`[RabbitMQ] Message NACK/Rejected by Broker! id=${messageBody.message_id}`);
          reject(err);
        } else {
          console.log(`[RabbitMQ] Safe ACK Received from Broker for id=${messageBody.message_id}`);
          resolve(messageBody);
        }
      }
    );
  });
}

// פונקציית שליחה ספציפית לסימולציות המשתמשת במנוע הגנרי
export async function publishSimulationRun(
  simulation: any,
  runId: string,
  system1Name: string,
  system2Name: string,
  messageCount: number,
  messageFrequencyHz: number
): Promise<BaseRabbitMessage<SimulationRunPayload>> {
  console.log(`[Publisher] Preparing to publish simulation run message for runId: ${runId}`);
  // 1. קריאה לבילדר הייעודי
  const message = buildSimulationRunMessage(simulation, runId, system1Name, system2Name, messageCount, messageFrequencyHz);
  
  // 2. שליחה דרך המנוע הגנרי עם מפתח הניתוב המתאים
  await publishMessage<SimulationRunPayload>(QUEUES.generator_queue.routingKey, message);
  
  return message;
}