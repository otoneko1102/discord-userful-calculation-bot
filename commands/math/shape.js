const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

const cmds = ['tri','tri-sin','pt','heron','bret','sin','cos','tan','sin-r','cos-r','tan-r'];

module.exports = {
    name: 'shape',
    aliases: ['s'],
    description: `Shape functions.\n(type: ${cmds})`,
    showHelp: true,
    utilisation: '{prefix}shape {type} {value}',
    cmds: cmds,
  
    async execute(client, message, args) {
      const embed = new MessageEmbed()
         
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
      //tri
      if (args[0] === cmds[0]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side},{height}`);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          if (!value[0] || !value[1]){
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side},{height}`);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          const side = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const height = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
          if (side <= 0 || height <= 0){
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side},{height}`);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          const result = Math.round(((side * height) / 2) * (10 ** 15)) / (10 ** 15);
          
          s_embed.setDescription(`Triangle area is **${result}**.`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side},{height}`);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //tri-sin
      if (args[0] === cmds[1]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{angle}`);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          if (!value[0] || !value[1]){
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{angle}`);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          const v1 = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const v2 = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
          const sin = Math.round(Math.sin(math.evaluate(value[2]) * (Math.PI / 180)) * (10 ** 15)) / (10 ** 15);
          if (v1 <= 0 || v2 <= 0 || sin <= 0){
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{angle}`);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          const result = Math.round((0.5 * v1 * v2 * sin) * (10 ** 15)) / (10 ** 15);
          
          s_embed.setDescription(`Triangle area is **${result}**.`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{angle}`);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //pt
      if (args[0] === cmds[2]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\`\n({side1} < {side3},\n{side2} < {side3},\nReplace {side} you want to answer with \`x\`.)`);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          let result;
          if (value[0] === 'x' && value[1] !== 'x' && value[2] !== 'x'){
            const v1 = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
            const v2 = Math.round(math.evaluate(value[2]) * (10 ** 15)) / (10 ** 15);
            if(v1 <= 0 || v2 <= 0 || v1 > v2){
              c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\`\n({side1} < {side3},\n{side2} < {side3},\nReplace {side} you want to answer with \`x\`.)`);
              message.reply({embeds: [c_err_embed]});
              return;
            }
            result = Math.sqrt((v2 ** 2) - (v1 ** 2));
          }else if(value[1] === 'x' && value[0] !== 'x' && value[2] !== 'x'){
            const v1 = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
            const v2 = Math.round(math.evaluate(value[2]) * (10 ** 15)) / (10 ** 15);
            if(v1 <= 0 || v2 <= 0 || v1 > v2){
              c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\`\n({side1} < {side3},\n{side2} < {side3},\nReplace {side} you want to answer with \`x\`.)`);
              message.reply({embeds: [c_err_embed]});
              return;
            }
            result = Math.sqrt((v2 ** 2) - (v1 ** 2));
          }else if(value[2] === 'x' && value[0] !== 'x' && value[1] !== 'x'){
            const v1 = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
            const v2 = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
            if(v1 <= 0 || v2 <= 0 || v1 > v2){
              c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\`\n({side1} < {side3},\n{side2} < {side3},\nReplace {side} you want to answer with \`x\`.)`);
              message.reply({embeds: [c_err_embed]});
              return;
            }
            result = Math.sqrt((v1 ** 2) + (v2 ** 2));
          }else{
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\`\n({side1} < {side3},\n{side2} < {side3},\nReplace {side} you want to answer with \`x\`.)`);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          
          s_embed.setDescription(`x = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\`\n({side1} < {side3},\n{side2} < {side3},\nReplace {side} you want to answer with \`x\`.)`);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //heron
      if (args[0] === cmds[3]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          const r1 = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const r2 = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
          const r3 = Math.round(math.evaluate(value[2]) * (10 ** 15)) / (10 ** 15);
          const s = (r1 + r2 + r3) / 2;
          const result = Math.sqrt(s * (s - r1) * (s - r2) * (s - r3));
          if (isNaN(result) || result === 0){
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\``);
          message.reply({embeds: [c_err_embed]});
          return;
          }
          s_embed.setDescription(`Triangle area is **${result}**.`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3}\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //bret
      if (args[0] === cmds[4]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3},{side4},{angle1},{angle2}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          const s1 = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const s2 = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
          const s3 = Math.round(math.evaluate(value[2]) * (10 ** 15)) / (10 ** 15);
          const s4 = Math.round(math.evaluate(value[3]) * (10 ** 15)) / (10 ** 15);         
          const t = (s1 + s2 + s3 + s4) / 2;

          const a1 = Math.round(math.evaluate(value[4]) * (10 ** 15)) / (10 ** 15);
          const a2 = Math.round(math.evaluate(value[5]) * (10 ** 15)) / (10 ** 15);
          const cos = Math.cos((a1 + a2) / 2 * (Math.PI / 180));
          const u = Math.round(s1 * s2 * s3 * s4 * (cos ** 2) * (10 ** 15)) / (10 ** 15);

          const result = Math.round(Math.sqrt((t - s1) * (t - s2) * (t - s3) * (t - s4) - u) * (10 ** 15)) / (10 ** 15);

          if (isNaN(result) || result === 0){
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3},{side4},{angle1},{angle2}\``);
          message.reply({embeds: [c_err_embed]});
          return;
          }
          s_embed.setDescription(`Square area is **${result}**.`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {side1},{side2},{side3},{side4},{angle1},{angle2}\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //sin
      if (args[0] === cmds[5]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const result = Math.round(Math.sin(math.evaluate(value) * (Math.PI / 180)) * (10 ** 15)) / (10 ** 15);
          s_embed.setDescription(`sin(${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')})° = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //cos
      if (args[0] === cmds[6]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const result = Math.round(Math.cos(math.evaluate(value) * (Math.PI / 180)) * (10 ** 15)) / (10 ** 15);
          s_embed.setDescription(`cos(${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')})° = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //tan
      if (args[0] === cmds[7]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const angle = math.evaluate(value);
          let result;
          if(angle % 90 === 0){
            result = undefined;
          }else{
            result = Math.round(Math.tan(angle * (Math.PI / 180)) * (10 ** 15)) / (10 ** 15);
          }
          s_embed.setDescription(`tan(${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')})° = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //sin-r
      if (args[0] === cmds[8]){
        try{
          message.reply('Coming soon...')
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //cos-r
      if (args[0] === cmds[9]){
        try{
          message.reply('Coming soon...')
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //tan-r
      if (args[0] === cmds[10]){
        try{
          message.reply('Coming soon...')
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
    },
};
