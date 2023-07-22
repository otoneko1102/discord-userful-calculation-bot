const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

module.exports = {
    name: 'info',
    aliases: ['i'],
    description: 'Show information.',
    showHelp: true,
    utilisation: '{prefix}info',

    execute(client, message, args) {
      const embed = new MessageEmbed();
      const btn = new MessageButton();
      btn.setLabel('Invite bot');
      btn.setStyle('LINK');
      btn.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=412384488512&scope=bot`)
      const row = new MessageActionRow().addComponents(btn);
      const guildId = message.guild.id;
      const prefix = getPrefix(guildId) || client.config.px;
      
      function getPrefix(guildId) {
        const query = db.prepare('SELECT prefix FROM prefixes WHERE guild_id = ?');
        const result = query.get(guildId);
        return result ? result.prefix : null;
      };
      
        embed.setColor('BLUE');
        embed.setTitle(client.user.username);
        const commands = client.commands.filter(x => x.showHelp !== false);
        embed.addField(`ID`,client.user.id);
        embed.addField(`Version`,client.config.playing.replace(/ \| /g,'\n'));
        embed.addField(`Prefix`,`**${prefix}** (Default: **${client.config.px}**)`);
        embed.addField(`Number of commands`,`${commands.size} commands\n➥${client.config.ccmds.length} conv types\n➥${client.config.dcmds.length} decide types\n➥${client.config.cmds.length} math types\n➥${client.config.rcmds.length} random types\n➥${client.config.scmds.length} script languages`);
        embed.addField(`Number of servers`,`${client.guilds.cache.size}servers`);
        const users = client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c);
        embed.addField(`Number of users`,`${users}users`)
        message.reply({ embeds: [embed], components: [row] });
    },
};
