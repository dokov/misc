const utils = require('./utils');
const validation = require('./validation-utils');

class CacheFuncWrapper {
  constructor(engine) {
    if (!engine) {
      throw new Error('Missing mandatory argument: "engine"');
    }
    this._engine = engine;
  }

  wrapPromiseFunc(func, options) {
    this._validateOptions(options);
    return async (...args) => {
      const key = (options && options.key != null) || utils.formCacheKey(args);
      validation.validateCacheKey(key);
      // ...
      
    };
  }

  _validateOptions(options) {
    if (options == null) {
      return;
    }
    if (options.key != null && typeof options.key !== 'string' || options.key === '') {
      throw new Error(`Invalid key "${options.key}"`);
    }
  }
}

module.exports = CacheFuncWrapper;
