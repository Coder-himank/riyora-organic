import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL); 
// REDIS_URL example: redis://default:password@localhost:6379

export default redis;
