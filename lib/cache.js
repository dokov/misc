const _defaults = require('lodash.defaults');
const _cloneDeep = require('lodash.clonedeep');

const constants = require('./constants');
const utils = require('./utils');

class Cache {
  constructor(engine, options = {}) {
    if (!engine) {
      throw new Error('Missing is mandatory argument: "engine"');
    }
    this._engine = engine;
    this._options = _defaults({}, options, {
      unwrapValue: true,
      keyPartCount: 1,
      keyGroup: ''
    });
    this._validateClassOptions(this._options);
  }

  async set(...args) {
    const [value, options] = args.slice(this._options.keyPartCount); // ignore subsequent arguments
    this._validateValue(value);
    this._validateMethodOptions(options);

    const key = this._formKeyFromArgs(args);
    return await this._setToEngine(key, value, _defaults({}, options, this._options)); // TODO: method options - subset of class options?
  }

  async get(...args) {
    let options = args[this._options.keyPartCount]; // ignore subsequent arguments
    this._validateMethodOptions(options);
    options = _defaults({}, options, this._options);
    const key = this._formKeyFromArgs(args);
    return await this._getFromEngine(key, options);
  }

  async invalidate(...args) {
    await this._engine.delete(this._formKeyFromArgs(args));
  }

  wrapFunction(func, cacheOptions) {
    this._validateMethodOptions(cacheOptions);
    cacheOptions = _defaults({ unwrapValue: false }, cacheOptions, this._options);
    return async (...args) => {
      const key = this._formKeyFromArgs(args);

      const cachedResult = await this._getFromEngine(key, cacheOptions); // await this.get(...args, _defaults({ unwrapValue: false }, cacheOptions));
      if (cachedResult) {
        return this._unwrapValue(cachedResult);
      }

      const funcResult = await func(...args);
      this._validateValue(funcResult);
      this._setToEngine(key, funcResult, cacheOptions);

      return funcResult;
    };
  }

  async _setToEngine(key, value, options) {
    try {
      await this._engine.set(key, this._wrapValue(value, options), options);
    } catch (err) {
      if (options.throwErrors) {
        throw err;
      }
    }
  }
  
  async _getFromEngine(key, options) {
    try {
      const wrappedValue = await this._engine.get(key, options);
      if (wrappedValue && options.unwrapValue) {
        return this._unwrapValue(wrappedValue);
      }
      return wrappedValue;
    } catch (err) {
      if (options.throwErrors) {
        throw err;
      }
    }
  }

  _formKey(keyParts) {
    return utils.formCacheKey(keyParts, this._options.keyGroup);
  }

  _formKeyFromArgs(args) {
    const keyParts = args.slice(0, this._options.keyPartCount);
    keyParts.forEach(p => this._validateKey(p));
    return this._formKey(keyParts);
  }

  _wrapValue(value, options) {
    const ts = new Date();
    return {
      value: _cloneDeep(value),
      cachedTimestamp: ts,
      ttl: options.ttl,
      expires: new Date(ts + options.ttl)
    };
  }

  _unwrapValue(wrappedValue) {
    return wrappedValue.value;
  }

  // TODO: Use Joi for validations?
  _validateKey(key) {
    if (!utils.isNonemptyString(key)) {
      throw new Error(`Invalid key "${key}". Keys must be nonempty strings`);
    }
  }

  _validateValue(value) {
    if (typeof value === 'undefined' || Number.isNaN(value)) {
      throw new Error(`Value cannot be "${Number.isNaN(value) ? 'NaN' : typeof value}"`);
    }
  }

  _validateMethodOptions(options) {
    if (typeof options !== 'object' && typeof options !== 'undefined') {
      throw new Error('Invalid options object');
    }
  }

  _validateClassOptions(options) {
    if (options && options.keyPartCount != null && (options.keyPartCount < 1 || typeof options.keyPartCount !== 'number' || Number.isNaN(options.keyPartCount))) {
      throw new Error(`Invalid key part count "${options.keyPartCount}"`);
    }
  }
}

module.exports = Cache;
