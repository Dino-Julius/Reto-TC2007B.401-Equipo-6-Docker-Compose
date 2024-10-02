const pool = require('./db');

// Función para crear un nuevo post
const createPost = async (postData) => {
    const { title, content, partner_id, date, summary, file_path, category } = postData;
    const res = await pool.query(
        'INSERT INTO posts (title, content, partner_id, date, summary, file_path, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, content, partner_id, date, summary, file_path, category]
    );
    return res.rows[0];
};

// Función para obtener un post por su ID
const getPostById = async (post_id) => {
    const res = await pool.query('SELECT * FROM posts WHERE post_id = $1', [post_id]);
    return res.rows[0];
};

// Función para obtener un post por su título
const getPostByTitle = async (title) => {
    const res = await pool.query('SELECT * FROM posts WHERE title = $1', [title]);
    return res.rows[0];
};

// Función para obtener todos los posts
const getAllPosts = async () => {
    const res = await pool.query('SELECT * FROM posts');
    return res.rows;
};

// Función para actualizar un post por su ID
const updatePostById = async (post_id, postData) => {
    const { title, content, partner_id, date, summary, file_path, category } = postData;
    const res = await pool.query(
        'UPDATE posts SET title = $1, content = $2, partner_id = $3, date = $4, summary = $5, file_path = $6, category = $7 WHERE post_id = $8 RETURNING *',
        [title, content, partner_id, date, summary, file_path, category, post_id]
    );
    return res.rows[0];
};

module.exports = {
    createPost,
    getPostById,
    getPostByTitle,
    getAllPosts,
    updatePostById,
};