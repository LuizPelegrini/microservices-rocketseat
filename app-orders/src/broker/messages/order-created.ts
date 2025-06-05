import { channels } from "../channels/index.ts"
import type { OrderCreatedMessage } from '../../../../contracts/created-order-message.ts';

export const dispatchOrderCreated = (data: OrderCreatedMessage) => {
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}