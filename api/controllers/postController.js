const postModel = require('../models/postModel');

// Crear un nuevo post
const createPost = async (req, res) => {
    const postData = req.body;
    if (req.file) {
        postData.file_path = `/media/zazil_posts/${req.file.filename}`; // Ruta relativa que Nginx servirá
    }
    try {
        const newPost = await postModel.createPost(postData);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
};

// Obtener todos los posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
};

// Obtener un post por su ID
const getPostById = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await postModel.getPostById(post_id);
        if (post) {
            // Asegúrate de que la URL del archivo esté incluida en la respuesta
            post.fileUrl = `http://localhost${post.file_path}`;
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el post:', error);
        res.status(500).json({ error: 'Error al obtener el post' });
    }
};

// Obtener un post por su título
const getPostByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const post = await postModel.getPostByTitle(title);
        if (post) {
            // Asegúrate de que la URL del archivo esté incluida en la respuesta
            post.fileUrl = `http://localhost${post.file_path}`;
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el post:', error);
        res.status(500).json({ error: 'Error al obtener el post' });
    }
};

// Modificar un post por su ID
const updatePostById = async (req, res) => {
    const { post_id } = req.params;
    const postData = req.body;
    if (req.file) {
        postData.file_path = `/media/zazil_posts/${req.file.filename}`; // Ruta relativa que Nginx servirá
    }
    try {
        const updatedPost = await postModel.updatePostById(post_id, postData);
        if (updatedPost) {
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el post:', error);
        res.status(500).json({ error: 'Error al actualizar el post' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getPostByTitle,
    updatePostById,
};