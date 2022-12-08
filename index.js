const express = require('express');
var cors = require('cors'); // Import the cors module
require('dotenv').config()

const app = express();
app.use(cors()); // Use the cors middleware
const port = process.env.PORT || 3000; // Set the port to listen on

const channelID = process.env.CHANNELID; // Get the Discord channel ID from an environment variable

const { Client, GatewayIntentBits } = require('discord.js'); // Import the Discord.js library
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

/*bot.on('messageCreate', async message => {
  console.log(message);
});*/

bot.login(process.env.TOKEN); // Login to the Discord bot using a token from an environment variable

app.get('/', (req, res) => {
    // Serve the `index.html` file when the root URL is requested
    res.sendFile('index.html', { root: __dirname });
});

app.get('/newGame', async (req, res) => {
    bot.channels
        .fetch(channelID) // Fetch the channel with the ID specified in the `channelID` variable
        .then((channel) => {
            // Set up a filter to wait for a specific message from the bot
            const filter = (m) => {
                return (
                    m.content == 'ID newGame\nok' && !m.author.equals(bot.user)
                );
            };

            // Wait for the bot to respond with a message that matches the filter
            channel
                .awaitMessages({
                    filter,
                    max: 1,
                })
                .then((collected) => {
                    // Once the message is received, send a JSON response to the client
                    res.json({ status: 'ok' });
                })
                .catch((err) => {
                    console.log(err);
                });

            // Send a message to the bot with the `ID newGame` and the value of the `elo` query parameter
            channel.send(`ID newGame\n${req.query.elo}`);
        })
        .catch((err) => {
            res.json({ err: 'Missing channel' });
        });
});

app.get('/play', async (req, res) => {
    bot.channels
        .fetch(channelID) // Fetch the channel with the ID specified in the `channelID` variable
        .then((channel) => {
            // Set up a filter to wait for a specific message from the bot
            const filter = (m) => {
                return (
                    m.content.match(/ID play\n\w\d\w\d\w?/) && !m.author.equals(bot.user)
                );
            };

            // Wait for the bot to respond with a message that matches the filter
            channel
                .awaitMessages({
                    filter,
                    max: 1,
                })
                .then((collected) => {
                    // Once the message is received, extract the move from the message and send it back to the client as a JSON response
                    const move = collected.entries().next().value[1].content.match(
                        /\w\d\w\d\w?/
                    )[0];
                    res.json({ move });
                })
                .catch((err) => {
                    console.log(err);
                });
            // Send a message to the bot with the `ID play` and the values of the `FEN` and `movetime` query parameters
            channel.send(
                `ID play\n${req.query.FEN}\n${req.query.movetime || 'null'}`
            );
        })
        .catch((err) => {
            res.json({ err: 'Missing channel' });
        });
    // Send a message to the bot with the `ID play` and the values of the `FEN` and `movetime` query parameters
    channel.send(
        `ID play\n${req.query.FEN}\n${req.query.movetime || 'null'}`
    );
});

app.get('/move', async (req, res) => {
    bot.channels
        .fetch(channelID) // Fetch the channel with the ID specified in the channelID variable
        .then((channel) => {
            // Set up a filter to wait for a specific message from the bot
            const filter = (m) => {
                return (
                    m.content.match(/ID move\n\w\d\w\d\w?/) && !m.author.equals(bot.user)
                );
            };
            // Wait for the bot to respond with a message that matches the filter
            channel
                .awaitMessages({
                    filter,
                    max: 1,
                })
                .then((collected) => {
                    // Once the message is received, extract the move from the message and send it back to the client as a JSON response
                    const move = collected.entries().next().value[1].content.match(
                        /\w\d\w\d\w?/
                    )[0];
                    res.json({ move });
                })
                .catch((err) => {
                    console.log(err);
                });

            // Send a message to the bot with the `ID move` and the values of the `move` and `movetime` query parameters
            channel.send(
                `ID move\n${req.query.move || 'null'}\n${req.query.movetime || 'null'}`
            );
        })
        .catch((err) => {
            res.json({ err: 'Missing channel' });
        });
});

app.listen(port, () => {
    // Log a message when the server starts listening on the specified port
    console.log(`Example app listening on port ${port}`);
});