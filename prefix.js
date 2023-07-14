const { MessageEmbed } = require("discord.js");
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

module.exports = {
    name: 'prefix',
    aliases: [],
    description: 'Prefix change to new prefix or reset.',
    utilisation: '{prefix}prefix (value)',

    execute(client, message, args) {
      
      const guildId = message.guild.id;
      const prefix = getPrefix(guildId) || client.config.px;
      
      function getPrefix(guildId) {
        const query = db.prepare('SELECT prefix FROM prefixes WHERE guild_id = ?');
        const result = query.get(guildId);
        return result ? result.prefix : null;
      };
      
      const embed = new MessageEmbed()
             .setTitle(`prefix`)
             .setColor('GREEN');
      const err_embed = new MessageEmbed()
                 .setTitle(`Failed: Missing permission.`)
                 .addField(`Usage example`,`\`${prefix}prefix (value)\``)
                 .setFooter({text: `{} = Required,() = Optional`})
                 .setColor('RED');
      
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({embeds: [err_embed]});
        if (!args[0]) {
      deletePrefix(guildId);
      embed.setDescription(`Prefix has been reset to \`${client.config.px}\`.`)
      message.reply({embeds: [embed]});
      try{
      message.guild.members.cache.get(client.user.id).setNickname(null);
      }catch{
        console.log('Failed to change nickname.')
      }
    } else {
      setPrefix(guildId, args[0]);
      embed.setDescription(`Prefix has been changed to \`${args[0]}\`.`)
      message.reply({embeds: [embed]});
      try{
      message.guild.members.cache.get(client.user.id).setNickname(`[${args[0]}]${client.user.username}`);
      }catch{
        console.log('Failed to change nickname.')
      }
    };
      
      function setPrefix(guildId, newPrefix) {
        const createTableQuery = db.prepare('CREATE TABLE IF NOT EXISTS prefixes (guild_id TEXT PRIMARY KEY, prefix TEXT)');
        createTableQuery.run();
        
        const insertQuery = db.prepare('INSERT OR REPLACE INTO prefixes (guild_id, prefix) VALUES (?, ?)');
        insertQuery.run(guildId, newPrefix);
      };
      
      function deletePrefix(guildId) {
        const deleteQuery = db.prepare('DELETE FROM prefixes WHERE guild_id = ?');
        deleteQuery.run(guildId);
      };
      
    },
};
