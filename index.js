const Discord = require('discord.js');
const config = require("./config.json");
const bot = new Discord.Client({disableEveryone: true});

bot.login(config.token);

// Log stats-bot in to the server and set status
bot.on("ready", async () => {
console.log(`${bot.user.username} has logged in.`)
bot.user.setActivity('People active on the server.', { type: 'WATCHING' })
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  .catch(console.error);

// Get our server
const guild = bot.guilds.get('819809682968805466'); // Server ID from Widget in Server Settings

// Get our stats channels
const totalUsers = bot.channels.get('819825781189771275'); // Channel ID where total users will be displayed
const onlineUsers = bot.channels.get('819825835749146694'); // Channel ID where online users will be displayed
const onlineBots = bot.channels.get('819825870151614465'); // Channel ID where total bots will be displayed

// Check every 30 seconds for changes (I would recommend a minute or so.)
setInterval(function() {
  console.log('Getting stats update..')

  //Get actual counts
  var userCount = guild.memberCount;
  var onlineCount = guild.members.filter(m => m.presence.status === 'online').size // Checking online users
  var botCount = guild.roles.get('819827083488133141').members.size; // Role ID of bots to count them
  
  // Log counts for debugging
  console.log("Total Users: " + userCount);
  console.log("Online Users: " + onlineCount);
  console.log("Bots: " + botCount);

  // Set channel names
  totalUsers.setName("Total Users: " + userCount)
  .then(newChannel => console.log(`Stat channel renamed to: ${newChannel.name}`))
  .catch(console.error);

  onlineUsers.setName("Online Users: " + onlineCount)
  .then(newChannel => console.log(`Stat channel renamed to: ${newChannel.name}`))
  .catch(console.error);

  onlineBots.setName("Bots: " + botCount)
  .then(newChannel => console.log(`Stat channel renamed to: ${newChannel.name}`))
  .catch(console.error);
  }, 30000)

});

// I would prefer using this one as it just prints out the latency and no code execution is done.
// bot.on('message', message => {
//   if (message.content === config.prefix + ' ping') {  
//     message.channel.send(`🏓 My Latency is ${Date.now() - message.createdTimestamp}ms.`);
//   }
// });

// This looks super cool but increases the ping as it generates the RichEmbed and nearly doubles your ping
// hence I have added divided by 2 though you can remove it if you want to as it still increase it by a 10-100ms
// due to the calculations but I still prefer it like this.
bot.on('message', message => {
  if (message.content === config.prefix + ' ping') {  
    // It sends the user "Pinging"
    message.channel.send("Pinging...").then(m => {

      var Latency = Date.now() - message.createdTimestamp; // The math thingy to calculate the user's ping
      Latency /= 2;
      Latency = ~~Latency;      // Reference: https://stackoverflow.com/questions/7641818/how-can-i-remove-the-decimal-part-from-javascript-number
      let embed = new Discord.RichEmbed()
      .setAuthor(`🏓 Bot Latency is ${~~Latency} ms.`)
      .setColor("#00FF00")

      // Then It Edits the message with the ping variable embed that you created
      m.edit(embed)
  })
}});