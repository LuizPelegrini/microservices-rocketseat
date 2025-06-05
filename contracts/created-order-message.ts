export type OrderCreatedMessage = {
  orderId: string;
  amount: number;
  customer: {
    id: string;
  }
}