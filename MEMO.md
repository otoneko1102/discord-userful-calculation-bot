# Base
```js
//example: calc (commands/math/...)
      if (args[0] === cmds[0]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const result = Math.round(math.evaluate(value) * (10 ** 16)) / (10 ** 16);
          s_embed.setDescription(`${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')} = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
```
