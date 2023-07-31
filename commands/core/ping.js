const { MessageEmbed } = require("discord.js");
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Pong.',
    showHelp: true,
    utilisation: '{prefix}ping',

    execute(client, message) {
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
        .setTitle('Pong.')
        .addField(`Web Socket`,`**${client.ws.ping}ms**`)
        .addField(`API Endpoint`,`**${Date.now() - message.createdTimestamp}ms**`)
        .setColor('GREEN')
      const c_err_embed = new MessageEmbed()
                 .setTitle(`Failed: Error.`)
                 .setFooter({ text: `{} = Required,() = Optional` })
                 .addField(`Usage example`,`\`${prefix}ping\``)
                 .setColor('RED');
      try{
        message.reply({embeds: [embed]});
      }catch{
        message.reply({embeds: [c_err_embed]});
      }
    },
};
