const express = require('express');
var cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const channelID = process.env.CHANNELID;

const { Client, GatewayIntentBits } = require('discord.js');
const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
]});

/*bot.on('messageCreate', async message => {
    console.log(message);
});*/

bot.login(process.env.TOKEN);

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: __dirname});
})

app.get('/newGame', async (req,res)=>{
    bot.channels.fetch(channelID)   .then(channel=>{
        const filter = m=>{return m.content=='ID newGame\nok' && !m.author.equals(bot.user)};
        channel.awaitMessages({
            filter, max:1
        }).then(collected=>{
            res.json({status:"ok"});
        }).catch(err=>{
            console.log(err)
        });
        
        channel.send(`ID newGame\n${req.query.elo}`);
    }).catch(err=>{
        res.json({err:"Missing channel"})
    });
})


app.get('/play', async (req,res)=>{
    bot.channels.fetch(channelID).then(channel=>{
        const filter = m=>{return m.content.match(/ID play\n\w\d\w\d\w?/) && !m.author.equals(bot.user)};
        channel.awaitMessages({
            filter, max:1
        }).then(collected=>{
            res.json({move:collected.entries().next().value[1].content.match(/\w\d\w\d\w?/)[0]});
        }).catch(err=>{
            console.log(err)
        });
        
        channel.send(`ID play\n${req.query.FEN}\n${req.query.movetime||"null"}`);
    }).catch(err=>{
        res.json({err:"Missing channel"})
    });
})

app.get('/move', async (req,res)=>{
    bot.channels.fetch(channelID).then(channel=>{
        const filter = m=>{return m.content.match(/ID move\n\w\d\w\d\w?/) && !m.author.equals(bot.user)};
        channel.awaitMessages({
            filter, max:1
        }).then(collected=>{
            res.json({move:collected.entries().next().value[1].content.match(/\w\d\w\d\w?/)[0]});
        }).catch(err=>{
            console.log(err)
        });
        
        channel.send(`ID move\n${req.query.move||"null"}\n${req.query.movetime||"null"}`);
    }).catch(err=>{
        res.json({err:"Missing channel"})
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})