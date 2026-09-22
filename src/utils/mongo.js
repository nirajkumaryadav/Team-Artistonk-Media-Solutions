const { ObjectId } = require('mongodb');

function toObjectId(value) {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

function serialize(document) {
  if (!document) return null;
  const result = { ...document, id: document._id.toString() };
  delete result._id;
  return result;
}

module.exports = { toObjectId, serialize };
