import Redis from 'ioredis';

let redisClient: Redis;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const config = useRuntimeConfig();

    redisClient = new Redis({
      host: config.redis.host || 'localhost',
      port: config.redis.port || 6379,
      password: config.redis.password || undefined,
      db: config.redis.db || 0,
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  return redisClient;
}

process.on('beforeExit', () => {
  if (redisClient) {
    redisClient.disconnect();
    console.log('Redis client disconnected');
  }
})