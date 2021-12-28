'use strict';

module.exports = (client, packet) => {
  client.actions.relationshipAdd.handle(packet.d);
};
