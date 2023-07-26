const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === 'dm') return;

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

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (cmd) cmd.execute(client, message, args);
};
