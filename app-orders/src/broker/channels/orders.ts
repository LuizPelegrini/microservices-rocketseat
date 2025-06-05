import { broker } from '../broker.ts';

export const orders = await broker.createChannel();

// creating queue where we're gonna publish the messages to
await orders.assertQueue('orders')