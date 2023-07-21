const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

const language = {
  "js": {
    "type": "js",
    "compiler": "nodejs-16.14.0"
  },
  "py": {
    "type": "py",
    "compiler": "cpython-3.10.2"
  }
};

const cmds = ['js', 'py'];

module.exports = {
  name: 'script',
  aliases: ['s'],
  description: `Run script.(β)\n(type: ${cmds})`,
  showHelp: true,
  utilisation: '{prefix}script {lang} {code}',
  cmds: cmds,

  async execute(client, message, args) {
    const embed = new MessageEmbed();

    const guildId = message.guild.id;
    const prefix = getPrefix(guildId) || client.config.px;

    function getPrefix(guildId) {
      const query = db.prepare('SELECT prefix FROM prefixes WHERE guild_id = ?');
      const result = query.get(guildId);
      return result ? result.prefix : null;
    }

    if (!args[0]) {
      embed.setTitle(`Failed: Missing parameters.`)
        .addField(`Usage example`, `\`${prefix}script {lang} {code}\``)
        .addField('type', `${cmds}`)
        .setFooter('{text: {} = Required, () = Optional}')
        .setColor('RED');

      message.reply({ embeds: [embed] });
      return;
    }

    if (!cmds.includes(args[0])) {
      embed.setTitle(`Failed: Wrong type.`)
        .addField(`Usage example`, `\`${prefix}script {lang} {code}\``)
        .addField('type', `${cmds}`)
        .setFooter('{text: {} = Required, () = Optional}')
        .setColor('RED');

      message.reply({ embeds: [embed] });
      return;
    }

    const m_err_embed = embed.setTitle(`Failed: Missing parameters.`)
      .setFooter('{text: {} = Required, () = Optional}')
      .setColor('RED');
    const c_err_embed = embed.setTitle(`Failed: Error.`)
      .setFooter('{text: {} = Required, () = Optional}')
      .setColor('RED');
    const s_embed = new MessageEmbed()
      .setTitle(`${args[0]}`)
      .setColor('GREEN');

    //js
    if (args[0] === cmds[0]) {
      if (!args[1]) {
        m_err_embed.addField(`Usage example`, `\`${prefix}script ${args[0]} {code}\``);
        message.reply({ embeds: [m_err_embed] });
        return;
      }
      try {
        const code = args.slice(1).join(' ');
        const response = await fetch('https://wandbox.org/api/compile.json', {
          method: 'POST',
          body: JSON.stringify({
            code,
            compiler: language.js.compiler,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
        s_embed.setDescription(`\`\`\`${data.program_message}\n${data.program_output}\`\`\``);
        message.reply({ embeds: [s_embed] });
      } catch (error) {
        console.error(error);
        c_err_embed.addField(`Usage example`, `\`${prefix}script ${args[0]} {code}\``);
        message.reply({ embeds: [c_err_embed] });
      }
    }
    //py
    if (args[0] === cmds[1]) {
      if (!args[1]) {
        m_err_embed.addField(`Usage example`, `\`${prefix}script ${args[0]} {code}\``);
        message.reply({ embeds: [m_err_embed] });
        return;
      }
      try {
        const code = args.slice(1).join(' ');
        const response = await fetch('https://wandbox.org/api/compile.json', {
          method: 'POST',
          body: JSON.stringify({
            code,
            compiler: language.py.compiler,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
        s_embed.setDescription(`\`\`\`${data.program_message}\n${data.program_output}\`\`\``);
        message.reply({ embeds: [s_embed] });
      } catch (error) {
        console.error(error);
        c_err_embed.addField(`Usage example`, `\`${prefix}script ${args[0]} {code}\``);
        message.reply({ embeds: [c_err_embed] });
      }
    }
  },
};
