const constants = require('./constants');

function isNonemptyString(obj) {
  return !!obj && typeof obj === 'string';
}

function formCacheKey(keyParts, group) {
  const parts = group ? [group, ...keyParts] : keyParts;
  return parts.join(constants.keyGroupSeparator);
}

module.exports = {
  isNonemptyString,
  formCacheKey
};
