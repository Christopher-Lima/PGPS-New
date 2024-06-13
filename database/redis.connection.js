import { createClient } from 'redis';

const client = await createClient({
    url: 'redis://default:Woh5lSvBbdt7ZWJXcuQPnU4mu0vNxXHd@redis-13520.c308.sa-east-1-1.ec2.redns.redis-cloud.com:13520'
  })
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

console.log(client.isReady);
await client.set('key', 'value');
await client.disconnect();