class MemoryPersistenceEngine {
  constructor() {
    this._cache = new Map();
  }

  async set(key, value, options) {
    this._cache.set(key, value);
  }

  async get(key, options) {
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }
  }

  async delete(key) {
    this._cache.delete(key);
  }

  async hasKey(key) {
    return this._cache.has(key);
  }
}

module.exports = MemoryPersistenceEngine;
