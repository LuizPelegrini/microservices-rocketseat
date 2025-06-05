import '@opentelemetry/auto-instrumentations-node/register' // start orders tracing

import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { z } from 'zod'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '../db/client.ts';
import { schema } from '../db/schema/index.ts';
import { randomUUID } from 'node:crypto';
import { dispatchOrderCreated } from '../broker/messages/order-created.ts';
import { trace } from '@opentelemetry/api';
import { tracer } from '../tracer/tracer.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: '*' })

app.get('/health', () => {
  return 'OK'
});

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.coerce.number()
    })
  }
}, async (req, res) => {
  const { amount } = req.body;

  console.log('Creating an order with amount ', amount);

  const orderId = randomUUID();

  await db.insert(schema.orders).values({
    id: orderId,
    customerId: '0efa633d-d8b1-4808-8e43-2379f8674921',
    amount,
  })

  // EXAMPLE: add additonal custom attributes for better tracing during debugging
  trace.getActiveSpan()?.setAttribute('order_id', orderId);

  // EXAMPLE: wrapping slow code into for tracing/debugging
  const span = tracer.startSpan('Any tag here')
  span.setAttribute('any attribute for debugging', 'hello world')
  // any slow code here
  span.end();

  dispatchOrderCreated({
    orderId,
    amount,
    customer: {
      id: '0efa633d-d8b1-4808-8e43-2379f8674921',
    }
  })

  return res.status(201).send();
})

app.listen({ host: '0.0.0.0', port: 3333}).then(() => {
  console.log('[Orders] Server started at port 3333 🚀');
})
