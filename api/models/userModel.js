const pool = require("./db");

/**
 * Función para agregar un nuevo usuario
 */
const createUser = async (userData) => {
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone,
    email,
    password,
    profile_pic,
  } = userData;
  const res = await pool.query(
    "INSERT INTO Users (first_name, last_name, birth_date, gender, phone, email, password, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      first_name,
      last_name,
      birth_date,
      gender,
      phone,
      email,
      password,
      profile_pic,
    ]
  );
  return res.rows[0];
};

/**
 * Función para obtener todos los usuarios
 */
const getUsers = async () => {
  const res = await pool.query(
    "SELECT first_name, last_name, birth_date, gender, phone, email, profile_pic FROM Users"
  );
  return res.rows;
};

/**
 * Función para obtener un usuario por su correo electrónico
 */
const getUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
  return res.rows[0];
};

/**
 * Función para actualizar un usuario por su correo electrónico
 */
const updateUserByEmail = async (email, userData) => {
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone,
    new_email,
    profile_pic,
    password,
  } = userData;
  const res = await pool.query(
    "UPDATE Users SET first_name = $1, last_name = $2, birth_date = $3, gender = $4, phone = $5, email = $6, password = $7, profile_pic = $8 WHERE email = $9 RETURNING *",
    [
      first_name,
      last_name,
      birth_date,
      gender,
      phone,
      new_email,
      password,
      profile_pic,
      email,
    ]
  );
  return res.rows[0];
};

/**
 * Función para eliminar un usuario por su correo electrónico
 */
const deleteUserByEmail = async (email) => {
  const res = await pool.query(
    "DELETE FROM Users WHERE email = $1 RETURNING *",
    [email]
  );
  return res.rows[0];
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
};
