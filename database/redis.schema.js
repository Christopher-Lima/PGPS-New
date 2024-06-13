import { Entity, Schema } from 'redis-om';
import client from './client.js';

class GPS extends Entity {}

const gpsSchema = new Schema(GPS, {
  resourcename: { type: 'string' },
  lastdate: { type: 'string' },
  datatime: { type: 'string' },
  coordinates: { type: 'string' },
});

export const gpsRepository = client.fetchRepository(gpsSchema);

await gpsRepository.createIndex();