const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

const cmds = ['pf', 'hex', 'frac', 'deg-rad', 'rad-deg', 'm-inch', 'inch-m', 'c-f', 'f-c'];

module.exports = {
    name: 'conv',
    aliases: ['c'],
    description: `Convert values.\n(type: ${cmds})`,
    showHelp: true,
    utilisation: '{prefix}conv {type} {value}',
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

      if (!args[0]) {
          embed.setTitle(`Failed: Missing parameters.`)
               .addField(`Usage example`, `\`${prefix}conv {type} {value}\``)
               .addField('type', `${cmds}`)
               .setFooter({ text: `{} = Required,() = Optional` })
               .setColor('RED');

          message.reply({ embeds: [embed] });
          return;
      };

      if (!cmds.includes(args[0])) {
          embed.setTitle(`Failed: Wrong type.`)
               .addField(`Usage example`, `\`${prefix}conv {type} {value}\``)
               .addField('type', `${cmds}`)
               .setFooter({text: `{} = Required,() = Optional`})
               .setColor('RED');

          message.reply({ embeds: [embed] });
          return;
      };
      const m_err_embed = embed.setTitle(`Failed: Missing parameters.`)
                               .setFooter({ text: `{} = Required,() = Optional` })
                               .setColor('RED');
      const c_err_embed = embed.setTitle(`Failed: Error.`)
                               .setFooter({ text: `{} = Required,() = Optional` })
                               .setColor('RED');
      const s_embed = new MessageEmbed()
                               .setTitle(`${args[0]}`)
                               .setColor('GREEN');

      //pf
      if (args[0] === cmds[0]) {
          if (!args[1]) {
              m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula}\`\n(formula ≧ 2)`);
              message.reply({ embeds: [m_err_embed] });
              return;
          }
          try {
              const value = args.slice(1).join(' ').replace(/\*\*/g, '^').replace(/×/g, '*').replace(/÷/g, '/');
              const number = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
              if (isNaN(number) || number < 2) {
                  c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula}\`\n(formula ≧ 2)`);
                  message.reply({ embeds: [c_err_embed] });
                  return;
              }
              const factors = primeFactorization(number);
              s_embed.setDescription(`${value.replace(/ /g, '').replace(/\*/g, '×').replace(/\//g, '÷')} = **${factors.join('×')}**`);
              message.reply({ embeds: [s_embed] });
          } catch {
              c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula}\`\n(formula ≧ 2)`);
              message.reply({ embeds: [c_err_embed] });
          }

          function primeFactorization(num) {
              let factors = [];
              let divisor = 2;

              while (num >= 2) {
                  if (num % divisor === 0) {
                      factors.push(divisor);
                      num /= divisor;
                  } else {
                      divisor++;
                  }
              }
              return factors;
          }
      };

      //hex
      if (args[0] === cmds[1]) {
          if (!args[1]) {
              m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula},{prev hex},{next hex}\`\n(2 ≦ {prev hex} ≦ 36,2 ≦ {next hex} ≦ 36)`);
              message.reply({ embeds: [m_err_embed] });
              return;
          };
          try {
              const str = args.slice(1).join(' ').split(',');
              const value = str[0].replace(/\*\*/g, '^').replace(/×/g, '*').replace(/÷/g, '/');
              console.log(value);
              const num = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
              const x = Math.floor(parseInt(str[1]));
              const y = Math.floor(parseInt(str[2]));

              if (isNaN(num) || isNaN(x) || isNaN(y) || x < 2 || y < 2 || x > 36 || y > 36) {
                  c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula},{prev hex},{next hex}\`\n(2 ≦ {prev hex} ≦ 36,2 ≦ {next hex} ≦ 36))`);
                  message.reply({ embeds: [c_err_embed] });
                  return;
              }

              const convertedNum = num.toString(y);
              s_embed.setDescription(`${num.toString(x)} (hex: ${x}) = **${convertedNum}** (hex: ${y})`);
              message.reply({ embeds: [s_embed] });
          } catch {
              c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula},{prev hex},{next hex}\`\n(2 ≦ {prev hex} ≦ 36,2 ≦ {next hex} ≦ 36)`);
              message.reply({ embeds: [c_err_embed] });
          }
      };

      //frac
      if (args[0] === cmds[2]) {
          if (!args[1]) {
              m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula}\``);
              message.reply({ embeds: [m_err_embed] });
              return;
          };
          try {
              const value = args.slice(1).join(' ').replace(/\*\*/g, '^').replace(/×/g, '*').replace(/÷/g, '/');
              console.log(value);
              const decimal = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
              const fraction = math.fraction(decimal);
              s_embed.setDescription(`${decimal} = **${fraction.n}/${fraction.d}**`);
              message.reply({ embeds: [s_embed] });
          } catch {
              c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {formula}\``);
              message.reply({ embeds: [c_err_embed] })
          }
      };
      //deg-rad
      if (args[0] === cmds[3]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}conv ${args[0]} {degree}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const angle = math.evaluate(value);    
          const result = Math.round(angle * (Math.PI / 180) * (10 ** 15)) / (10 ** 15); 
          s_embed.setDescription(`(${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')})° = **${result}** rad`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}conv ${args[0]} {degree}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //deg-rad
      if (args[0] === cmds[4]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}conv ${args[0]} {radian}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const angle = math.evaluate(value);    
          const result = Math.round(angle * 180 / Math.PI * (10 ** 15)) / (10 ** 15); 
          s_embed.setDescription(`(${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) rad = **${result}**°`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}conv ${args[0]} {radian}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //m-inch
      if (args[0] === cmds[5]) {
        if (!args[1]){
          m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {meter}\``);
          message.reply({ embeds: [m_err_embed] });
          return;
        }
        try{
          const meters = Math.round(math.evaluate(args[1]) * (10 ** 15)) / (10 ** 15);
          if (isNaN(meters)) {
            c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {meter}\``);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          const inches = meters * 39.37;
          s_embed.setDescription(`${meters} m = **${inches}** in`);
          message.reply({ embeds: [s_embed] });
        } catch {
          c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {meter}\``);
          message.reply({ embeds: [c_err_embed] });
        }
      };
      //inch-m
      if (args[0] === cmds[6]) {
        if (!args[1]){
          m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {inch}\``);
          message.reply({ embeds: [m_err_embed] });
          return;
        }
        try{
          const inches = Math.round(math.evaluate(args[1]) * (10 ** 15)) / (10 ** 15);
          if (isNaN(inches)) {
            c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {inch}\``);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          const meters = inches * 0.0254;
          s_embed.setDescription(`${inches} in = **${meters}** m`);
          message.reply({ embeds: [s_embed] });
        } catch {
          c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {inch}\``);
          message.reply({ embeds: [c_err_embed] });
        }
      };
      //c-f
      if (args[0] === cmds[7]) {
        if (!args[1]) {
          m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {celsius}\``);
    　 　　message.reply({ embeds: [m_err_embed] });
          return;
        }
        try {
          const celsius = Math.round(math.evaluate(args[1]) * (10 ** 15)) / (10 ** 15);
          if (isNaN(celsius)) {
          c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {celsius}\``);
          message.reply({ embeds: [c_err_embed] });
          return;
          }
          const fahrenheit = (celsius * 9 / 5) + 32;
          s_embed.setDescription(`${celsius}°C = **${fahrenheit}°F**`);
          message.reply({ embeds: [s_embed] });
        } catch {
          c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {celsius}\``);
          message.reply({ embeds: [c_err_embed] });
        }
      };
      //f-c
      if (args[0] === cmds[8]) {
        if (!args[1]) {
          m_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {fahrenheit}\``);
          message.reply({ embeds: [m_err_embed] });
          return;
        }
        try {
          const fahrenheit = Math.round(math.evaluate(args[1]) * (10 ** 15)) / (10 ** 15);
          if (isNaN(fahrenheit)) {
            c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {fahrenheit}\``);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          const celsius = (fahrenheit - 32) * 5 / 9;
          s_embed.setDescription(`${fahrenheit}°F = **${celsius}°C**`);
          message.reply({ embeds: [s_embed] });
        } catch {
          c_err_embed.addField(`Usage example`, `\`${prefix}conv ${args[0]} {fahrenheit}\``);
          message.reply({ embeds: [c_err_embed] });
        }
      }
    },
};
