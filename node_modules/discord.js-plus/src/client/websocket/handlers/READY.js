'use strict';

let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.users.cache.set(clientUser.id, clientUser);
  }

  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  if (data.relationships) {
    for (const relationship of data.relationships) {
      client.relationships.add(relationship);
    }
  }

  if (data.presences) {
    for (const presence of data.presences) {
      if (client.relationships.cache.get(presence.user.id)) {
        presence.id = presence.user.id;
        client.relationships.presences.add(presence);
      }
    }
  }

  shard.checkReady();
};
