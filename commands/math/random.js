const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

const cmds = ['num','str'];

module.exports = {
    name: 'random',
    aliases: ['r'],
    description: `Random functions.\n(type: ${cmds})`,
    showHelp: true,
    utilisation: '{prefix}random {type} {value}',
    cmds: cmds,
  
    async execute(client, message, args) {
      const embed = new MessageEmbed()
         
      const guildId = message.guild.id;
      const prefix = getPrefix(guildId) || client.config.px;
      
      function getPrefix(guildId) {
        const query = db.prepare('SELECT prefix FROM prefixes WHERE guild_id = ?');
        const result = query.get(guildId);
        return result ? result.prefix : null;
      };
      
      if(!args[0]) {
        embed.setTitle(`Failed: Missing parameters.`)
             .addField(`Usage example`,`\`${prefix}random {type} {value}\``)
             .addField('type',`${cmds}`)
             .setFooter({text: `{} = Required,() = Optional`})
             .setColor('RED');
        
        message.reply({embeds: [embed]});
        return;
      };
      
      if(!cmds.includes(args[0])) {
        embed.setTitle(`Failed: Wrong type.`)
             .addField(`Usage example`,`\`${prefix}random {type} {value}\``)
             .addField('type',`${cmds}`)
             .setFooter({text: `{} = Required,() = Optional`})
             .setColor('RED');
        
        message.reply({embeds: [embed]});
        return;
      };
      const m_err_embed = embed.setTitle(`Failed: Missing parameters.`)
                               .setFooter({text: `{} = Required,() = Optional`})
                               .setColor('RED');
      const c_err_embed = embed.setTitle(`Failed: Error.`)
                               .setFooter({text: `{} = Required,() = Optional`})
                               .setColor('RED');
      const s_embed = new MessageEmbed()
                               .setTitle(`${args[0]}`)
                               .setColor('GREEN'); 
      //num
      if (args[0] === cmds[0]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const count = parseInt(args[1]);
          if(isNaN(count)){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          let reply = ['output','is'];
          if(count !== 1){
            reply = ['outputs','are']
          }
          const value = args.slice(2).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          const max = Math.floor(parseInt(value[0]));
          const min = Math.floor(parseInt(value[1])) + 1;
          if (isNaN(max) || isNaN(min) || count <= 0){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          if (min < max){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          let results = [];
          for (let i = 0; i < count; i++) {
            const result = Math.floor(Math.random() * (max - min) + min);
            results.push(result);
          }
          const result_str = `The ${reply[0]} from ${value[0]} to ${value[1]} ${reply[1]}...\n**${results.join('**,**')}**.`;
          if (result_str.length > 2000){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          s_embed.setDescription(result_str);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //str
      if (args[0] === cmds[1]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {str1},(str2),...\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const count = parseInt(args[1]);
          if(isNaN(count)){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {min},{max}\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          let reply = ['output','is'];
          if(count !== 1){
            reply = ['outputs','are']
          }
          const value = args.slice(2).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          const max = value.length;
          const min = 0;
          if (isNaN(max) || count <= 0){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {str1},(str2),...\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          let results = [];
          for (let i = 0; i < count; i++) {
            const no = Math.floor(Math.random() * max);
            const result = value[no];
            results.push(result);
          }
          const result_str = `The ${reply[0]} from (${value}) ${reply[1]}...\n**${results.join('**,**')}**.`;
          if (result_str.length > 2000){
            c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {str1},(str2),...\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          s_embed.setDescription(result_str);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}random ${args[0]} {count} {str1},(str2),...\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
    },
}
