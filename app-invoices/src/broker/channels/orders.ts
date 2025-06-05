import { broker } from '../broker.ts';

export const orders = await broker.createChannel();

// telling RabbitMQ that this channel/topic is a "queue" style (in rabbitMQ topics can be "exchange" style)
await orders.assertQueue('orders')