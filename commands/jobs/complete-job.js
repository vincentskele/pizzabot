const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const db = require('../../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('complete-job')
    .setDescription('Complete a job and reward a user (Admin Only).')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to reward')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('jobid')
        .setDescription('The ID of the job to complete')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('reward')
        .setDescription('The amount of currency to reward')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, member } = interaction;

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '🚫 Only admins can complete jobs.', ephemeral: true });
    }

    const targetUser = options.getUser('user');
    const jobID = options.getInteger('jobid');
    const reward = options.getInteger('reward');

    if (!targetUser || !jobID || !reward) {
      return interaction.reply({ content: '🚫 All fields (user, job ID, reward) are required.', ephemeral: true });
    }

    try {
      const result = await db.completeJob(jobID, targetUser.id, reward);
      if (!result) {
        return interaction.reply({ content: `🚫 Job ${jobID} does not exist.`, ephemeral: true });
      }
      if (result.notAssigned) {
        return interaction.reply({ content: `🚫 <@${targetUser.id}> is not assigned to job ${jobID}.`, ephemeral: true });
      }

      // Send success reply
      await interaction.reply(
        `✅ Completed job ${jobID} for <@${targetUser.id}> with reward **${reward}** 🍕!`
      );

      // Check if email is configured
      if (
        process.env.EMAIL_HOST &&
        process.env.EMAIL_PORT &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASSWORD &&
        process.env.EMAIL_TO
      ) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false, // use TLS
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        // Send email
        const emailInfo = await transporter.sendMail({
          from: `"Discord Bot" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO,
          subject: `Job Completed: ${jobID}`,
          text: `Job ${jobID} was successfully completed for user ${targetUser.tag} (${targetUser.id}). Reward: ${reward} 🍕.`,
          html: `<p>Job <strong>${jobID}</strong> was successfully completed for user <strong>${targetUser.tag} (${targetUser.id})</strong>.</p><p>Reward: <strong>${reward} 🍕</strong>.</p>`,
        });

        console.log('Email sent:', emailInfo.messageId);
      } else {
        console.log('Email not sent: Email configuration is missing in .env file.');
      }
    } catch (err) {
      console.error('Complete Job Slash Error:', err);
      return interaction.reply({ content: `🚫 Complete job failed: ${err.message || err}`, ephemeral: true });
    }
  }
};
