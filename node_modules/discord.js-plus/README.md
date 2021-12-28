
<div  align="center">

<p>

<a  href="https://www.npmjs.com/package/discord.js-plus/"><img  src="https://img.shields.io/npm/v/discord.js-plus.svg?maxAge=3600"  alt="NPM version"  /></a>
<a  href="https://www.npmjs.com/package/discord.js-plus/"><img  src="https://img.shields.io/npm/dt/discord.js-plus.svg?maxAge=3600"  alt="NPM downloads"  /></a>
</p>
<p>
<a  href="https://nodei.co/npm/discord.js-plus/"><img  src="https://nodei.co/npm/discord.js-plus.png?downloads=true&stars=true"  alt="npm installnfo"  /></a>
</p>
</div>

  

  

  

Discod.js+ Fork from [discord.js](https://github.com/discordjs/discord.js), allows you to use Selfbot with more features.

  

  

  

**__If you will be using the library to use selfbot so I am not responsible if your account is blocked because it is against [Discord ToS](https://discordapp.com/terms).__**

  

# Changes
|ClassOrEvent | PropOrMethod |
|:---:|:---|
| ClientEvents | `relationshipAdd(Relationship)`, `relationshipRemove(Relationship)`, `relationshipUpdate(Relationship, Relationship)` |
| Relationship `extends` Base | user: `User`, id: `UserId`, type: `number` |
| RelationshipsManager `extends` BaseManager | fetchAll(): `Promise<Collection<Snowflake, Relationship>>`, presences: `PresenceManager`|
| Client | relationships: `RelationshipsManager` |
| ClientUser | relationships: `Client#relationships`, friends: `Collection<Snowflake, User>`, blockList: `Collection<Snowflake, User>` |
| User | blocked: `boolean`, friend: `boolean`, block: `Promise<User>`, unblock: `Promise<User>`, addFriend: `Promise<User>`, removeFriend: `Promise<User>` |

  

  

# Examples

```js
const  {  Client  }  =  require('discord.js-plus')
const  client  =  new  Client();

client.on('ready',  ()  =>  {

	const  relationshipsSize  =  client.relationships.cache.size;
	const  blockedSize  =  client.user.blockList.size;
	const  friendsSize  =  client.user.friends.size;
	console.log(`You have ${relationshipsSize} relationships.`)
	console.log(`${blockedSize} blocked.`)
	console.log(`${friendsSize} friends.`)


})

  

```

```js

const { Client } = require('discord.js-plus')
const client = new Client();

client.on('ready', async() => {

	client.users.cache.get('ID').addFriend().then( () => {
		console.log('A friend request has been sent')
	}).catch(console.error)

})

```