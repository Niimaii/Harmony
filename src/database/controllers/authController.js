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

export default {
  getUsers,
};
