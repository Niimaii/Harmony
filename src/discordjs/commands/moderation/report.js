import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription(
      'Report user (WARNING: False reports will be treated as an offense)'
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('text')
        .setDescription('Report text offense')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('Server users')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('offense')
            .setDescription('Select the offense type')
            .setRequired(true)
            .addChoices(
              { name: 'Condescension or Bullying: 4.1.c', value: '4.1.c' },
              { name: 'Doxing: 4.1.d', value: '4.1.d' },
              { name: 'Discrimination: 4.1.b', value: '4.1.b' },
              { name: 'NSFW: 4.1.g', value: '4.1.g' },
              { name: 'Advertisement: 4.1.f', value: '4.1.f' },
              { name: 'Spam: 4.1.h', value: '4.1.h' },
              { name: 'No minors (must be 18+): 4.2.a', value: '4.2.a' },
              { name: 'Bot or duplicate account: 4.2.b', value: '4.2.b' }
            )
        )
        .addStringOption((option) =>
          option
            .setName('message_link')
            .setDescription(
              'Right click message and select "Copy Message Link"'
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('voice')
        .setDescription('Report voice offense')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('Server users')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('offense')
            .setDescription('Select the offense type')
            .setRequired(true)
            .addChoices(
              { name: 'Condescension or Bullying: 4.1.c', value: '4.1.c' },
              { name: 'Doxing: 4.1.d', value: '4.1.d' },
              { name: 'Discrimination: 4.1.b', value: '4.1.b' },
              { name: 'NSFW: 4.1.g', value: '4.1.g' },
              { name: 'Advertisement: 4.1.f', value: '4.1.f' },
              { name: 'Spam: 4.1.h', value: '4.1.h' },
              { name: 'No minors (must be 18+): 4.2.a', value: '4.2.a' },
              { name: 'Bot or duplicate account: 4.2.b', value: '4.2.b' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('other')
        .setDescription(
          "Report something that isn't either text or voice based"
        )
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('Server users')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('offense')
            .setDescription('Select the offense type')
            .setRequired(true)
            .addChoices(
              { name: 'No minors (must be 18+): 4.2.a', value: '4.2.a' },
              { name: 'Bot or duplicate account: 4.2.b', value: '4.2.b' }
            )
        )
    ),

  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    interaction.reply('Pong!');

    const client = interaction.client;
    const guild = interaction.guild;

    try {
      const guildCollection = await guild.members.fetch();
      // Filter members who have the "Parliament" role into an array of id's
      const parliamentMembers = guildCollection
        .filter((member) =>
          member.roles.cache.some((role) => role.name === 'Collaborator')
        )
        .map((member) => member.id);
      // Condense the `guildCollection` into an array of user id's
      const userIdList = Array.from(guildCollection.keys());
      // 'Anarchy" is user 6
      const userObject = await client.users.fetch('1007782572799049768');

      // Send a DM to user
      const dmChannel = await userObject.createDM();
      await dmChannel.send(
        'Hey Jcen, this is the bot I will be using for the UnyFi server.'
      );
    } catch (error) {
      console.error(error);
    }
  },
};
