
const { SlashCommandBuilder } = require('@discordjs/builders'); // For creating slash commands
const { currency } = require('../../currency'); // Custom currency module
const db = require('../../db'); // Database module
const { PermissionsBitField } = require('discord.js'); // For permission checks

module.exports = {
  // Command definition
  data: new SlashCommandBuilder()
    .setName('bake')
    .setDescription('Admin command to generate money.'),

  // Command execution logic
  async execute(interaction) {
    try {
      // Fetch the list of bot admins from the database
      const admins = await db.getAdmins();

      // Get the user who invoked the command
      const member = interaction.member;

      // Check if the user is a Discord admin or a bot admin
      const isDiscordAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);
      const isBotAdmin = admins.includes(interaction.user.id);

      // If the user lacks admin permissions, deny the command
      if (!isDiscordAdmin && !isBotAdmin) {
        return interaction.reply({ content: `🚫 Only an admin can bake ${currency.symbol}.`, ephemeral: true });
      }

      // Define the amount to bake
      const bakeAmount = 6969;

      // Update the user's wallet in the database with the baked amount
      await db.addToWallet(interaction.user.id, bakeAmount);

      // Respond to the user indicating success
      return interaction.reply(`${currency.symbol} You baked ${bakeAmount} ${currency.name} into your wallet!`);
    } catch (err) {
      // Catch and handle errors
      console.error(`Error executing /bake command: ${err}`);
      return interaction.reply({ content: `🚫 Command failed: ${err}`, ephemeral: true });
    }
  }
};