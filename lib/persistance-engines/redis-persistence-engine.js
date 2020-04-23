const _defaults = require('lodash.defaults');
const Redis = require('ioredis');

class RedisPersistenceEngine {
  constructor(redisCfg) {
    this._redisCfg = redisCfg;
    this._client = new Redis(_defaults(this._redisCfg, {
      reconnectOnError: this._reconnectOnError, // Handle elasticache failover and reconnect to master
      maxRetriesPerRequest: 3
    }));
  }

  async initialize() {
    await this._client.connect();
  }

  async shutDown() {
    await this._client.quit();
  }

  async set(key, value, options) {
    const ttlArgs = options && options.ttl ? ['px', options.ttl] : [];
    await this._client.set(key, this._serialize(value), ...ttlArgs);
  }

  async get(key, options) {
    const val = await this._client.get(key);
    return this._deserialize(val);
  }

  async delete(key) {
    await this._client.del(key);
  }

  async hasKey(key) {
    return (await this._client.exists(key)) === 1;
  }

  _serialize(obj) {
    return JSON.stringify(obj);
  }

  _deserialize(serializedObj) {
    return JSON.parse(serializedObj);
  }

  _reconnectOnError(err) {
    if (err.message.includes('READONLY')) {
      return true;
    }
  }
}

module.exports = RedisPersistenceEngine;
