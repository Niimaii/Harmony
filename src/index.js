import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Routes,
} from 'discord.js';
import { DISCORD_TOKEN } from '../config.js';
import fs from 'node:fs';
import path from 'node:path';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function getFiles(dir) {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  let commandFiles = [];

  //   Loop through all the files and folders in the `command` folder
  for (const file of files) {
    // If a folder is being looped over, run `getFiles()` recursively so that all the files in that folder is accounted for
    if (file.isDirectory()) {
      commandFiles = [...commandFiles, ...getFiles(`${dir}/${file.name}`)];
    }
    // If what is being looped over a file that ends with .js, then add the file path to `commandFiles`
    else if (file.name.endsWith('.js')) {
      commandFiles.push(`${dir}/${file.name}`);
    }
  }

  return commandFiles;
}

async function getCommands(dir) {
  let commands = new Collection();
  const commandFiles = getFiles(dir);

  for (const commandFile of commandFiles) {
    const command = await import(path.resolve(commandFile));
    commands.set(command.default.data.toJSON().name, command.default);
  }
  return commands;
}
(async () => {
  client.commands = await getCommands('./src/commands');

  client.once(Events.ClientReady, (c) => {
    console.log(`${c.user.tag} logged in`);
  });
  client.on(Events.InteractionCreate, async (interaction) => {
    console.log('Client.on ran');
    const log = await client.commands;
    console.log(log);
    if (!interaction.isChatInputCommand()) return;

    console.log(`Command received: ${interaction.commandName}`);

    let command = client.commands.get(interaction.commandName);

    try {
      if (interaction.replied) return;
      command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  });

  client.login(DISCORD_TOKEN);
})();
