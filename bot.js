const timezone = require("moment-timezone");
const moment = require("moment");
const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (message.content.startsWith("!time help")) {
    helpResponse(message);
  } else if (message.content.startsWith("!time suh")) {
    suhGif(message);
  } else if (message.content.startsWith("!time joke")) {
    jokes(message);
  } else if (message.content.startsWith("!time", 0)) {
    timeResponse(message);
  }
});

function helpResponse(message) {
  message.channel.send(
    "Use me by calling my name, giving me a time, and a timezone like `!time 5pm cst`. I currently support est, cst, mst, pst, bst, and cest timezones."
  );
}

function timeResponse(message) {
  let args = message.content.split(" ");
  args = args.splice(1);
  if (args.length == 0 || args[0].replace(/\D/g, "") == "") {
    message.channel.send("Please use the correct format: `time 2:30pm pst`");
  } else {
    message.channel.send(formatMessage(args));
  }
}

function suhGif(message) {
  let suh = [
    "https://gfycat.com/agededucatedblesbok",
    "https://media.giphy.com/media/QZF6K7YEPhPNK/giphy.gif"
  ];
  message.channel.send(suh[Math.floor(Math.random() * suh.length)]);
}
function jokes(message) {
  let user = message.author.username;
  let userJoke = `Time is nothing to joke about, ${user}`;
  let jokes = [
    userJoke,
    " Why did Mr. Krabs buy so many clocks? Because time is money.  ",
    "I don't joke about time",
    "I would but I ran out of time",
    " At what time do most people go to the dentist? At tooth-hurty (2:30)"
  ];

  message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
}

function parseTimeZone(time) {
  if (time[1] == undefined) {
    return timezone.tz(time[0], "h:mm a", "America/Chicago");
  }

  switch (time[1].toUpperCase()) {
    case "EDT":
    case "EST":
      return timezone.tz(time[0], "h:mm a", "America/New_York");
      break;
    case "CDT":
    case "CST":
      return timezone.tz(time[0], "h:mm a", "America/Chicago");
      break;
    case "MDT":
    case "MST":
      return timezone.tz(time[0], "h:mm a", "America/Denver");
      break;
    case "PDT":
    case "PST":
      return timezone.tz(time[0], "h:mm a", "America/Los_Angeles");
      break;
    case "BST":
      return timezone.tz(time[0], "h:mm a", "Europe/London");
      break;
    case "CEST":
      return timezone.tz(time[0], "h:mm a", "Europe/Paris");
      break;
    case "GMT":
      return timezone.tz(time[0], "h:mm a", "Etc/GMT-0");
      break;
    default:
      return timezone.tz(time[0], "h:mm a", "America/Chicago");
  }
}

function getTimezones(time) {
  return [
    "North America",
    timezone
      .tz(moment(time, "h:mm a zz"), "America/New_York")
      .format("h:mm a z"),
    timezone.tz(moment(time, "h:mm a z"), "America/Chicago").format("h:mm a z"),
    timezone.tz(moment(time, "h:mm a z"), "America/Denver").format("h:mm a z"),
    timezone
      .tz(moment(time, "h:mm a z"), "America/Los_Angeles")
      .format("h:mm a z"),
    "Europe",
    timezone.tz(moment(time, "h:mm a z"), "Europe/London").format("h:mm a z"),
    timezone.tz(moment(time, "h:mm a z"), "Europe/Paris").format("h:mm a z"),
    "GMT",
    timezone.tz(moment(time, "h:mm a z"), "Etc/GMT-0").format("h:mm a z")
  ];
}

function formatMessage(msg) {
  let times = getTimezones(parseTimeZone(msg));
  let message = [];
  message.push("```json");
  message.push(times.join("\n"));
  message.push("```");
  return message;
}

client.login(auth.token);
