const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Pong.',
    utilisation: '{prefix}ping',

    execute(client, message) {
      const embed = new MessageEmbed()
        .setTitle('Pong.')
        .addField(`Web Socket`,`**${client.ws.ping}ms**`)
        .addField(`API Endpoint`,`**${Date.now() - message.createdTimestamp}ms**`)
        .setColor('GREEN')
      message.reply({embeds: [embed]});
    },
};
