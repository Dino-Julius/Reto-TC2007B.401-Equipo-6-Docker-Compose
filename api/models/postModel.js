const pool = require('./db');

/**
 * Función para crear un nuevo post
 */
const createPost = async (postData) => {
    const { title, summary, date, category, partner_email, file_path, image_path } = postData;
    const res = await pool.query(
        'INSERT INTO posts (title, summary, date, category, partner_email, file_path, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, summary, date, category, partner_email, file_path, image_path]
    );
    return res.rows[0];
};

/**
 * Función para obtener todos los posts
 */
const getPosts = async () => {
    const res = await pool.query('SELECT * FROM posts');
    return res.rows;
};

/**
 * Función para obtener un post por su ID
 */
const getPostById = async (post_id) => {
    const res = await pool.query('SELECT * FROM posts WHERE post_id = $1', [post_id]);
    return res.rows[0];
};

/**
 * Función para obtener un post por su título
 */
const getPostByTitle = async (title) => {
    const res = await pool.query('SELECT * FROM posts WHERE title = $1', [title]);
    return res.rows[0];
};

/**
 * Función para obtener todos los posts de un socio por su partner_id
 */
const getPostsByPartnerId = async (partner_email) => {
    const res = await pool.query('SELECT * FROM posts WHERE partner_email = $1', [partner_email]);
    return res.rows;
};

/**
 * Función para actualizar un post por su ID
 */
const updatePostById = async (post_id, postData) => {
    const { title, summary, date, category, partner_email, file_path, image_path } = postData;
    const res = await pool.query(
        'UPDATE posts SET title = $1, summary = $2, date = $3, category = $4, partner_email = $5, file_path = $6, image_path = $7 WHERE post_id = $8 RETURNING *',
        [title, summary, date, category, partner_email, file_path, image_path, post_id]
    );
    return res.rows[0];
};

/**
 * Función para eliminar un post por su ID
 */
const deletePostById = async (post_id) => {
    const res = await pool.query('DELETE FROM posts WHERE post_id = $1 RETURNING *', [post_id]);
    return res.rows[0];
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostByTitle,
    getPostsByPartnerId,
    updatePostById,
    deletePostById,
};