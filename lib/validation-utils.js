const utils = require('./utils');

// TODO: Use Joi for validations?
function validateCacheKey(key) {
  if (!utils.isNonemptyString(key)) {
    throw new Error(`Invalid key "${key}". Keys must be nonempty strings`);
  }
}

// function validateValue(value) {
//   if (typeof value === 'undefined' || Number.isNaN(value)) {
//     throw new Error(`Value cannot be "${isNaN(value) ? 'NaN' : typeof value}"`);
//   }
// }

// function validateMethodOptions(options) {
//   if (typeof options !== 'object' && typeof options !== 'undefined') {
//     throw new Error('Invalid options object');
//   }
// }

// function validateClassOptions(options) {
//   if (options && options.keyPartCount != null && (options.keyPartCount < 1 || typeof options.keyPartCount !== 'number' || Number.isNaN(options.keyPartCount))) {
//     throw new Error(`Invalid key part count "${options.keyPartCount}"`);
//   }
// }

module.exports = {
  validateCacheKey
};
