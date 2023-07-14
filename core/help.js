const { MessageEmbed } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Show help.',
    showHelp: true,
    utilisation: '{prefix}help',

    execute(client, message, args) {
      const embed = new MessageEmbed();
      
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
        embed.setDescription(client.config.playing.replace(/ \| /g,'\n'))
        embed.addField(`${commands.size} commands\n➥${client.config.ccmds.length} conv types\n➥${client.config.dcmds.length} decide types\n➥${client.config.cmds.length} math types\n➥${client.config.rcmds.length} random types`, commands.map(x => `**${x.utilisation.replace(/{prefix}/g,prefix)}** ${x.aliases[0] ? ` (aliase: **${x.aliases.map(y => y).join('/')}**)` : ''}\n${x.description ?? '---'}`).join('\n'));
        embed.setFooter({text: `{} = Required,() = Optional\nUsage example: ${prefix}{command}`})

        message.reply({ embeds: [embed] });
    },
};