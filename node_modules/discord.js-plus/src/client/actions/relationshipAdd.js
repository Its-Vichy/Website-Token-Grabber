'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class relationshipAdd extends Action {
  handle(data) {
    if (this.client.bot) return;
    const relationship = this.client.relationships.cache.get(data.id);
    if (relationship) {
      const oldRelationship = relationship._clone();

      this.client.emit(Events.RELATIONSHIP_UPDATE, this.client.relationships.add(data), oldRelationship);
    } else {
      this.client.emit(Events.RELATIONSHIP_ADD, this.client.relationships.add(data));
    }
  }
}

module.exports = relationshipAdd;
