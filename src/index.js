import path from 'node:path';
import fs from 'node:fs';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } from './config.js';
import { fileURLToPath } from 'node:url';
import express from 'express';

// ================================== DATABASE ==================================

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => console.log(`App listening on port ${port}`));

// ================================== DISCORDJS ==================================

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'discordjs/commands');
const commandFolders = fs.readdirSync(foldersPath);

async function loadCommands() {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command.default && 'execute' in command.default) {
        client.commands.set(command.default.data.name, command.default);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}

(async () => {
  await loadCommands();

  const eventsPath = path.join(__dirname, 'discordjs/events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);
    if (event.default.once) {
      client.once(event.default.name, (...args) =>
        event.default.execute(...args)
      );
    } else {
      client.on(event.default.name, (...args) =>
        event.default.execute(...args)
      );
    }
  }

  // Log in to Discord with your client's token
  client.login(DISCORD_TOKEN);
})();
