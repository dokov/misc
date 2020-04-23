const cloneDeep = require('lodash.clonedeep');
const constants = require('./lib/constants');
const Cache = require('./lib/cache');
const MemoryPersistenceEngine = require('./lib/persistance-engines/memory-persistence-engine');
const RedisPersistenceEngine = require('./lib/persistance-engines/redis-persistence-engine');

// (async () => {
//   const pers = new MemoryPersistenceEngine();
//   const cache = new Cache(pers, { keyPartCount: 3 });
//   await cache.set('a', 'b', 'c', { myObj: true });
//   const got = await cache.get('a', 'b', 'c');
//   console.log('got: ', got);
//   function someFunc(key1, key2, key3, someOtherArg, etc) {
//     return { someObj: true };
//   }
//   const wrapped = cache.wrapFunction(someFunc);
//   const res1 = await wrapped('d', 'e', 'f', { someOtherArg: 1 }, { etc: 2 });
//   console.log('res1: ', res1);
//   await new Promise(res => setTimeout(res, 1));
//   const res2 = await wrapped('d', 'e', 'f', { someOtherArg: 1 }, { etc: 2 });
//   console.log('res2: ', res2);
// })();

(async () => {
  const pers = new RedisPersistenceEngine({
    port: 6379,
    host: 'localhost',
    password: null,
    lazyConnect: true
  });
  const cache = new Cache(pers, { keyPartCount: 3, ttl: 10000 });
  // await cache.set('a', 'b', 'c', { myObj: true }, { ttl: 5000 });
  // const got = await cache.get('a', 'b', 'c');
  // console.log('got: ', got);
  function someFunc(key1, key2, key3, someOtherArg, etc) {
    console.log('called func');
    return { someObj: true };
  }
  const wrapped = cache.wrapFunction(someFunc, { ttl: 5000 });
  const res1 = await wrapped('d', 'e', 'f', { someOtherArg: 1 }, { etc: 2 });
  console.log('res1: ', res1);
  // await new Promise(res => setTimeout(res, 1));
  const res2 = await wrapped('d', 'e', 'f', { someOtherArg: 1 }, { etc: 2 });
  console.log('res2: ', res2);
})();

module.exports = {
  constants: {
    persistance: cloneDeep(constants.persistance)
  },
  wrap() { },
  cacheFactory(options) {
    let engine = null;
    if (options.persistance === constants.persistance.redis) {
      engine = {};
    }
    return new Cache(engine)
  }
};
