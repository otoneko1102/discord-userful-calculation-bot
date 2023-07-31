module.exports = async (client) => {
    console.log(`${client.user.username} Login!`);
    const users = client.guilds.cache
    .map((guild) => guild.memberCount)
    .reduce((p, c) => p + c);
  const statuses = [
    {
      name: `${client.config.px}help | ${client.guilds.cache.size}servers`,
      type: 'WATCHING',
    },
    {
      name: `${client.config.px}help | ${users}users`,
      type: 'WATCHING',
    },
    {
      name: `${client.config.playing}`,
      type: 'PLAYING',
    }
  ];

  let statusIndex = 0;

  setInterval(() => {
    client.user.setPresence({
      activities: [statuses[statusIndex]]
    });
    statusIndex = (statusIndex + 1) % statuses.length;
  }, 10000);
};
