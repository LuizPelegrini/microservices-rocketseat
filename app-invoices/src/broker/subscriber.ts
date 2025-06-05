import { orders } from './channels/orders.ts';

// consuming messages from orders channel
orders.consume('orders', async message => {
  if(!message) {
    return null;
  }

  console.log(message.content.toString());

  orders.ack(message); // explicitly acknowledging message
}, {
  noAck: false, // we want to explicitly acknowledge when the message is finally processed, 'cause we can treat some errors ourselves 
})