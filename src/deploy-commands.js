import fs from 'node:fs';
import path from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } from '../config.js';

console.log('deploy-commands ran');
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

async function loadCommands() {
  let commands = [];
  const commandFiles = getFiles('./src/commands');

  for (const file of commandFiles) {
    const command = await import(path.resolve(file));
    //   Push all the commands within "data" in each file
    commands.push(command.default.data.toJSON());
  }

  return commands;
}

(async () => {
  const commands = await loadCommands();
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  // Run all the commands in our specific server
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    .then(() =>
      console.log('Successfully registered the application commands!')
    )
    .catch(console.error);
})();
