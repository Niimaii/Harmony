import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription(
      'Report user (WARNING: False reports will be treated as an offense)'
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
          { name: 'Spam', value: 'spam' },
          { name: 'Harassment', value: 'harassment' },
          { name: 'Hate Speech', value: 'hate_speech' },
          { name: 'Cheating', value: 'cheating' },
          { name: 'Other', value: 'other' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Describe what happened (optional)')
        .setRequired(false)
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
