const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../db');
const { currency, formatCurrency } = require('../../currency');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-item')
    .setDescription('Add a new item to the shop. (Admin Only)')
    .addIntegerOption(option =>
      option.setName('price')
        .setDescription(`The price of the item in ${currency.symbol}`)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the item')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('A brief description of the item')
        .setRequired(true)),

  async execute(interaction) {
    try {
      // Defer the reply immediately to avoid timeout issues
      await interaction.deferReply({ ephemeral: true });

      // Check for admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.editReply({ content: '🚫 Only admins can add items.' });
      }

      // Retrieve inputs
      const price = interaction.options.getInteger('price');
      const name = interaction.options.getString('name');
      const description = interaction.options.getString('description');

      // Validate inputs
      if (!price || price <= 0 || !name || !description) {
        return interaction.editReply({ content: '🚫 Invalid input. Ensure all fields are filled.' });
      }

      // Add item to the database
      await db.addShopItem(price, name.trim(), description.trim());

      // Create and send the success embed
      const embed = new EmbedBuilder()
        .setTitle(`✅ Added ${name.trim()} to the Shop`)
        .addFields(
          { name: 'Price', value: `${formatCurrency(price)}` },
          { name: 'Description', value: `${description.trim()}` }
        )
        .setColor(0x32CD32)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Add Shop Item Error:', err);
      await interaction.editReply({
        content: `🚫 Failed to add item: ${err.message || 'Unknown error.'}`,
      });
    }
  },
};
