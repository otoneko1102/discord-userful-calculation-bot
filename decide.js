const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

const cmds = ['prime','fib','happy'];

module.exports = {
    name: 'decide',
    aliases: ['d'],
    description: `Decide functions.\n(type: ${cmds})`,
    showHelp: true,
    utilisation: '{prefix}decide {type} {value}',
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
             .addField(`Usage example`,`\`${prefix}math {type} {value}\``)
             .addField('type',`${cmds}`)
             .setFooter({text: `{} = Required,() = Optional`})
             .setColor('RED');
        
        message.reply({embeds: [embed]});
        return;
      };
      
      if(!cmds.includes(args[0])) {
        embed.setTitle(`Failed: Wrong type.`)
             .addField(`Usage example`,`\`${prefix}math {type} {value}\``)
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
      //prime
      if (args[0] === cmds[0]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const num = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
          if (isPrime(num)) {
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is a prime number.__`);
            message.reply({embeds: [s_embed]});
          }else{
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is not a prime number.__`);
            message.reply({embeds: [s_embed]});
          };
          
        function isPrime(num) {
          if (num <= 1) {
            return false;
          }
          for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
              return false;
            }
          }
          return true;
        }
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //fib
      if (args[0] === cmds[1]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const num = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
          if (isFib(num)) {
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is a fibonacci number.__`);
            message.reply({embeds: [s_embed]});
          }else{
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is not a fibonacci number.__`);
            message.reply({embeds: [s_embed]});
          };
          
          function isFib(num) {
            if (num < 0) {
              return false;
            }
            const sqrt5 = Math.sqrt(5);
            const phi = (1 + sqrt5) / 2;
            const psi = (1 - sqrt5) / 2;

            for (let i = 0; ; i++) {
              let fib = (1 / sqrt5) * ((Math.pow(phi, i) - Math.pow(psi, i)));
              fib = Math.floor(fib)
              if (fib === num) {
                return true;
              } else if (fib > num) {
                return false;
              }
            }
          }
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //happy
      if (args[0] === cmds[2]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const num = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
          if (num <= 0){
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is not a happy number.__`);
            message.reply({embeds: [s_embed]});
            return;
          }
          if (isHappyNumber(num)) {
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is a happy number.__`);
            message.reply({embeds: [s_embed]});
          }else{
            s_embed.setDescription(`**${num}** (formula: ${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) __is not a happy number.__`);
            message.reply({embeds: [s_embed]});
          };

          function isHappyNumber(num) {
            const seenNumbers = new Set();

            while (num !== 1 && !seenNumbers.has(num)) {
              seenNumbers.add(num);
              num = getSquareSum(num);
            }
            return num === 1;
          }
          
          function getSquareSum(num) {
            let sum = 0;
            while (num > 0) {
              const digit = num % 10;
              sum += digit * digit;
              num = Math.floor(num / 10);
            }
            return sum;
          }

        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
    },
}
