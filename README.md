# discord-userful-calculation-bot
Discord bot witten by discord.js v13 and mathjs for advanced calculations. You can use [Glitch](https://glitch.com/) to make it work.<br>
Use the following GS code to permanently run Glitch with [GAS (Google Apps Script)](https://script.google.com/).
```
/*
Paste this code into GAS.
After that, please execute it once and allow the access authority etc.
Set the GAS timer at 5 minute intervals and run it.
*/

var glitch_project_name = "" // Enter your Glitch project name here.
var GLITCH_URL = `https://${glitch_project_name}.glitch.me`;
function wakeGlitch(){
 var json = {
   'type':'wake'
 };
 sendGlitch(GLITCH_URL, json);
}
function sendGlitch(uri, json){
 var params = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : json,
   'muteHttpExceptions': true
 };
 response = UrlFetchApp.fetch(uri, params);
}

```
### I have no plans to create a project with the same functionality in discord.js v14.
If you have any questions or problems, please contact **@otoneko.** on Discord.
