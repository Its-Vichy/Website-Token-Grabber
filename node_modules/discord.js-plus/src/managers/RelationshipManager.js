'use strict';

const BaseManager = require('./BaseManager');
const PresenceManager = require('./PresenceManager');
const { User } = require('..');
const GuildMember = require('../structures/GuildMember');
const Message = require('../structures/Message');
const Relationship = require('../structures/Relationship');
const Collection = require('../util/Collection');

/**
 * Manages API methods for relationships and stores their cache.
 * @extends {BaseManager}
 */
class RelationshipManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Relationship);

    /**
     * Presences of relationships
     * @type {PresenceManager}
     */
    this.presences = new PresenceManager(client);
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, Relationship>}
   * @name Relationship#cache
   */

  /**
   * Data that resolves to give a Relationship object. This can be:
   * * A Relationship object
   * * A User object
   * * A Snowflake
   * * A Message object (resolves to the message author)
   * * A GuildMember object
   * @typedef {Relationship|User|Snowflake|Message|GuildMember} RelationshipResolvable
   */

  /**
   * Resolves a RelationshipResolvable to a Relationship object.
   * @param {RelationshipResolvable} relationship The RelationshipResolvable to identify
   * @returns {?User}
   */
  resolve(relationship) {
    if (relationship instanceof User) return relationship.relationship;
    if (relationship instanceof GuildMember) return relationship.user.relationship;
    if (relationship instanceof Message) return relationship.author.relationship;
    return super.resolve(relationship);
  }

  /**
   * Resolves a RelationshipResolvable to a relationship ID string.
   * @param {RelationshipResolvable} relationship The RelationshipResolvable to identify
   * @returns {?Snowflake}
   */
  resolveID(relationship) {
    if (relationship instanceof GuildMember) return relationship.relationship.id;
    if (relationship instanceof GuildMember) return relationship.user.relationship.id;
    if (relationship instanceof Message) return relationship.author.relationship.id;
    return super.resolveID(relationship);
  }
  /**
   * Obtains a relationships from Discord, or the relationships cache if it's already available.
   * @param {boolean} [cache=true] Whether to cache the new relationship object if it isn't already
   * @returns {Promise<Collection<Snowflake, Relationship>>}
   */
  async fetchAll(cache = true) {
    const data = await this.client.api.users('@me').relationships.get();
    const relationships = new Collection();
    for (const relationship of data) relationships.set(relationship.id, this.add(relationship, cache));
    return relationships;
  }
}

module.exports = RelationshipManager;
