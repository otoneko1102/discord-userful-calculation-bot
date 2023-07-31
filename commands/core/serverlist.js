const { MessageEmbed } = require("discord.js");
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

module.exports = {
    name: 'serverlist',
    aliases: ['sl'],
    description: 'List of servers that the bot is joined.',
    showHelp: true,
    utilisation: '{prefix}serverlist',

    async execute(client, message, args) {
      
      const guildId = message.guild.id;
      const prefix = getPrefix(guildId) || client.config.px;
      
      function getPrefix(guildId) {
        try{
          const query = db.prepare('SELECT prefix FROM prefixes WHERE guild_id = ?');
          const result = query.get(guildId);
          return result ? result.prefix : null;
        } catch {
          return null;
        }
      };
      
      const embed = new MessageEmbed()
             .setTitle(`prefix`)
             .setColor('GREEN');
      const err_embed = new MessageEmbed()
                 .setTitle(`Failed: Missing permission.`)
                 .addField(`Usage example`,`\`${prefix}serverlist\``)
                 .setFooter({text: `{} = Required,() = Optional`})
                 .setColor('RED');
      const c_err_embed = new MessageEmbed()
                 .setTitle(`Failed: Error.`)
                 .setFooter({ text: `{} = Required,() = Optional` })
                 .addField(`Usage example`,`\`${prefix}serverlist\``)
                 .setColor('RED');
      try{
        const servers = client.guilds.cache.map(guild => `${guild.name} - ${guild.id}`);
        const serverCount = servers.length;
      
        const maxFields = 20;
        const totalFields = Math.ceil(serverCount / maxFields);
        const embeds = [];

        for (let i = 0; i < totalFields; i++) {
          const start = i * maxFields;
          const end = start + maxFields;
          const fields = servers.slice(start, end);
        
          embed
            .setTitle(`${serverCount} servers`)
            .setColor('GREEN')
            .setFooter(fields.join('\n'));
        
          embeds.push(embed);
        }
      
        for (const embed of embeds) {
          await message.channel.send({ embeds: [embed] });
        }
      }catch{
        message.reply({embeds: [c_err_embed]});
      }
    },
};
