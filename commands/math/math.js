const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const Database = require('better-sqlite3');
const db = new Database('prefixes.db');

const cmds = ['calc','root','rec','abs','ave','pi','napier','tri','tri-sin','pt','heron','bret','sin','cos','tan','sin-r','cos-r','tan-r','npr','ncr','nhr'];

module.exports = {
    name: 'math',
    aliases: ['m'],
    description: `Math functions.\n(type: ${cmds})`,
    showHelp: true,
    utilisation: '{prefix}math {type} {value}',
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
      //calc
      if (args[0] === cmds[0]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const result = Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
          s_embed.setDescription(`${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')} = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //root
      if (args[0] === cmds[1]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula},{root}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          console.log(value);
          const num = value[0];
          const n = Math.round(math.evaluate(num) * (10 ** 15)) / (10 ** 15);
          const root = parseInt(value[1]);
          let result;
          if (root !== 0){
            result = math.nthRoot(n, root);
          }else{
            result = undefined;
          }
          const replacements = {
            '1': '¹',
            '2': '²',
            '3': '³',
            '4': '⁴',
            '5': '⁵',
            '6': '⁶',
            '7': '⁷',
            '8': '⁸',
            '9': '⁹',
            '0': '⁰',
            '-': '⁻',
            '.': '⋅'
          };
          const root_str = value[1].replace(/[1-9\-\.0]/g, match => replacements[match]);
          s_embed.setDescription(`${root_str}√(${num.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch(E){
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula},{root}\``);
          message.reply({embeds: [c_err_embed]});
          console.error(E)
        }
      };
      //rec
      if (args[0] === cmds[2]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const result = 1 / (Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15));
          s_embed.setDescription(`1/(${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //abs
      if (args[0] === cmds[3]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/');
          console.log(value);
          const num = math.abs(Math.round(math.evaluate(value) * (10 ** 15)) / (10 ** 15));
          if (isNaN(num)){
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
            message.reply({embeds: [c_err_embed]})
            return;
          }
          s_embed.setDescription(`|${value.replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}| = **${num}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //ave
      if (args[0] === cmds[4]) {
        if (!args[1]) {
          m_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {formula1},(formula2),...\``);
          message.reply({ embeds: [m_err_embed] });
          return;
        }
        try {
          const nums = [];
          const str = args.slice(1).join(' ').split(',');
          const values = str.map(formula => formula.replace(/\*\*/g, '^').replace(/×/g, '*').replace(/÷/g, '/'));
          for (const value of values) {
            const num = Math.floor(math.evaluate(value) * (10 ** 15)) / (10 ** 15);
            nums.push(num);
          }
          const sum = nums.reduce((a, b) => a + b, 0);
          const avg = sum / nums.length;
          if(isNaN(avg)){
            c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},(formula2),...\``);
            message.reply({embeds: [c_err_embed]});
            return;
          }
          s_embed.setDescription(`The average of (${args.slice(1).join(' ').replace(/ /g,'').replace(/\*/g,'×').replace(/\//g,'÷')}) is **${avg}**.`)
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},(formula2),...\``);
          message.reply({embeds: [c_err_embed]});
        }
      };
      //pi
      if (args[0] === cmds[5]) {
        if (!args[1]) {
          m_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n( 1 ≦　{digits} ≦ 2000)`);
          message.reply({ embeds: [m_err_embed] });
          return;
        }
        try {
          const pi_str = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275900';
          let digits = Math.floor(parseInt(args[1]));
          if (isNaN(digits)) {
            c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          if (digits < 1 || digits > 2000) {
            c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          let l = 0;
          if (digits !== 1) {
            l = 1;
          }
          try {
            const pi = pi_str.slice(0, digits + l) ?? 'Failed.';
            s_embed.setDescription(`π = ${pi}`);
            message.reply({ embeds: [s_embed] });
          } catch {
            c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
        } catch (error) {
          console.error(error);
          c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
          message.reply({ embeds: [c_err_embed] });
        }
      };
      //napier
      if (args[0] === cmds[6]) {
        if (!args[1]) {
          m_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
          message.reply({ embeds: [m_err_embed] });
          return;
        }
        try {
          const e_str = '2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354021234078498193343210681701210056278802351930332247450158539047304199577770935036604169973297250886876966403555707162268447162560798826517871341951246652010305921236677194325278675398558944896970964097545918569563802363701621120477427228364896134225164450781824423529486363721417402388934412479635743702637552944483379980161254922785092577825620926226483262779333865664816277251640191059004916449982893150566047258027786318641551956532442586982946959308019152987211725563475463964479101459040905862984967912874068705048958586717479854667757573205681288459205413340539220001137863009455606881667400169842055804033637953764520304024322566135278369511778838638744396625322498506549958862342818997077332761717839280349465014345588970719425863987727547109629537415211151368350627526023264847287039207643100595841166120545297030236472549296669381151373227536450988890313602057248176585118063036442812314965507047510254465011727211555194866850800368532281831521960037356252794495158284188294787610852639813'
          let digits = Math.floor(parseInt(args[1]));
          if (isNaN(digits)) {
            c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1　≦　{digits}　≦　2000)`);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          if (digits < 1 || digits > 2000) {
            c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1　≦　{digits}　≦　2000)`);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
          let l = 0;
          if (digits !== 1) {
            l = 1;
          }
          try {
            const e = e_str.slice(0, digits + l) ?? 'Failed.';
            s_embed.setDescription(`e = ${e}`);
            message.reply({ embeds: [s_embed] });
          } catch {
            c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
            message.reply({ embeds: [c_err_embed] });
            return;
          }
        } catch (error) {
          console.error(error);
          c_err_embed.addField(`Usage example`, `\`${prefix}math ${args[0]} {digits}\`\n(1 ≦ {digits} ≦ 2000)`);
          message.reply({ embeds: [c_err_embed] });
        }
      };
      //tri
      if (args[0] === cmds[7]){
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
      if (args[0] === cmds[8]){
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
      if (args[0] === cmds[9]){
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
      if (args[0] === cmds[10]){
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
      if (args[0] === cmds[11]){
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
      if (args[0] === cmds[12]){
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
      if (args[0] === cmds[13]){
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
      if (args[0] === cmds[14]){
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
      if (args[0] === cmds[15]){
        try{
          message.reply('Coming soon...')
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //cos-r
      if (args[0] === cmds[16]){
        try{
          message.reply('Coming soon...')
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //tan-r
      if (args[0] === cmds[17]){
        try{
          message.reply('Coming soon...')
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {angle}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //npr
      if (args[0] === cmds[18]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {value1},{value2}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          const n = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const r = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
            if(isNaN(n) || isNaN(r) || n < 0 || r < 0 || n < r || n % 1 != 0 || r % 1 != 0) {
              m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},{formula2}\``);
              message.reply({embeds: [m_err_embed]})
              return;
            };
          let result = 1;
          for (let i = 0; i < r; i++) {
            result *= (n - i);
          }
          const replacements = {
            '1': '₁',
            '2': '₂',
            '3': '₃',
            '4': '₄',
            '5': '₅',
            '6': '₆',
            '7': '₇',
            '8': '₈',
            '9': '₉',
            '0': '₀'
          };
          const n_str = value[0].replace(/[1-9\-\.0]/g, match => replacements[match]);
          const r_str = value[1].replace(/[1-9\-\.0]/g, match => replacements[match]);
          s_embed.setDescription(`${n_str}P${r_str} = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},{formula2}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //ncr
      if (args[0] === cmds[19]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {value1},{value2}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          const n = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const r = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
            if(isNaN(n) || isNaN(r) || n < 0 || r < 0 || n < r || n % 1 != 0 || r % 1 != 0) {
              m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},{formula2}\``);
              message.reply({embeds: [m_err_embed]})
              return;
            };
          let result = 1;
          for (let i = 0; i < r; i++) {
            result *= (n - i);
          }
          const rx = Math.round(math.evaluate(`${r}!`) * (10 ** 15)) / (10 ** 15);
          result = Math.round((result / rx) * (10 ** 15)) / (10 ** 15);
          const replacements = {
            '1': '₁',
            '2': '₂',
            '3': '₃',
            '4': '₄',
            '5': '₅',
            '6': '₆',
            '7': '₇',
            '8': '₈',
            '9': '₉',
            '0': '₀'
          };
          const n_str = value[0].replace(/[1-9\-\.0]/g, match => replacements[match]);
          const r_str = value[1].replace(/[1-9\-\.0]/g, match => replacements[match]);
          s_embed.setDescription(`${n_str}C${r_str} = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},{formula2}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
      //nhr
      if (args[0] === cmds[20]){
        if(!args[1]) {
          m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {value1},{value2}\``);
          message.reply({embeds: [m_err_embed]});
          return;
        };
        try{
          const value = args.slice(1).join(' ').replace(/\*\*/g,'^').replace(/×/g,'*').replace(/÷/g,'/').split(',');
          const n = Math.round(math.evaluate(value[0]) * (10 ** 15)) / (10 ** 15);
          const r = Math.round(math.evaluate(value[1]) * (10 ** 15)) / (10 ** 15);
            if(isNaN(n) || isNaN(r) || n < 0 || r < 0 || n < r || n % 1 != 0 || r % 1 != 0) {
              m_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},{formula2}\``);
              message.reply({embeds: [m_err_embed]})
              return;
            };
          let result = 1;
          for (let i = 0; i < r; i++) {
            result *= ((n + r - 1) - i);
          }
          const rx = Math.round(math.evaluate(`${r}!`) * (10 ** 15)) / (10 ** 15);
          result = Math.round((result / rx) * (10 ** 15)) / (10 ** 15);
          const replacements = {
            '1': '₁',
            '2': '₂',
            '3': '₃',
            '4': '₄',
            '5': '₅',
            '6': '₆',
            '7': '₇',
            '8': '₈',
            '9': '₉',
            '0': '₀'
          };
          const n_str = value[0].replace(/[1-9\-\.0]/g, match => replacements[match]);
          const r_str = value[1].replace(/[1-9\-\.0]/g, match => replacements[match]);
          s_embed.setDescription(`${n_str}H${r_str} = **${result}**`);
          message.reply({embeds: [s_embed]});
        }catch{
          c_err_embed.addField(`Usage example`,`\`${prefix}math ${args[0]} {formula1},{formula2}\``);
          message.reply({embeds: [c_err_embed]})
        }
      };
    },
};
