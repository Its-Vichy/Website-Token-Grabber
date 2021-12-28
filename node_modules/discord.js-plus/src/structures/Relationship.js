'use strict';

const Base = require('./Base');

/**
 * Represents a relationship on Discord.
 * @extends {Base}
 */
class Relationship extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the relationship
   */
  constructor(client, data) {
    super(client);
    /**
     * The user
     * @type {User}
     */
    this.user = client.users.add(data.user);

    /**
     * The ID of the user
     * @type {Snowflake}
     */
    this.id = this.user.id;

    /**
     * Type of relationship
     * @type {Number}
     */
    this.type = null;

    this._patch(data);
  }
  _patch(data) {
    if (typeof data.type !== 'undefined') this.type = data.type;
  }
}

module.exports = Relationship;
