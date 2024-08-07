import db from '../db.js';

const getUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');

    res.status(200).json({
      success: true,
      users: users.rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const createReport = async (req, res) => {
  try {
    const { user_id, suspect_discord, type, offense, message_link } = req.body;
    const user = await db.query('SELECT id FROM users WHERE discord_id = $1', [
      suspect_discord,
    ]);

    const usersID = user.rows[0].id;
    await db.query(
      'INSERT INTO reports (user_id, suspect_discord, type, offense, message_link) VALUES ($1, $2, $3, $4, $5);',
      [usersID, suspect_discord, type, offense, message_link]
    );

    res.status(201).json({
      success: true,
      message: 'Report made',
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default {
  getUsers,
  createReport,
};
