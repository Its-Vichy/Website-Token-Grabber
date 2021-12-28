'use strict';

module.exports = (client, packet) => {
  client.actions.relationshipRemove.handle(packet.d);
};
