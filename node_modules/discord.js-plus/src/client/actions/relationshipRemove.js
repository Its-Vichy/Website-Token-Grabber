'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class relationshipRemove extends Action {
  handle(data) {
    if (this.client.bot) return;
    this.client.relationships.presences.cache.delete(data.id);
    let r = this.client.relationships.cache.get(data.id);
    this.client.relationships.cache.delete(data.id);
    this.client.emit(Events.RELATIONSHIP_REMOVE, r);
  }
}

module.exports = relationshipRemove;
