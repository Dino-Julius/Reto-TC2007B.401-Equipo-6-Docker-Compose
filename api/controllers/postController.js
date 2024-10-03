const fs = require('fs');
const path = require('path');
const postModel = require('../models/postModel');

// Crear un nuevo post
const createPost = async (req, res) => {
    const postData = req.body;
    if (req.file) {
        filePath = `/media/zazil_posts/${req.file.filename}`; // Ruta relativa que Nginx servirá
        postData.file_path = filePath;
    }
    try {
        const newPost = await postModel.createPost(postData);
        res.status(201).json(newPost);
    } catch (error) {
      console.error("Error al crear el post:", error);
      // Eliminar el archivo si hubo un error al crear el post
      if (filePath) {
        const fullPath = path.join("/usr/share/nginx/html", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo:", err);
          } else {
            console.log("Archivo eliminado:", fullPath);
          }
        });
      }
      res.status(500).json({ error: "Error al crear el post" });
    }
};

// Obtener un post por su ID
const getPostById = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await postModel.getPostById(post_id);
        if (post) {
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
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el post:', error);
        res.status(500).json({ error: 'Error al obtener el post' });
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

// Actualizar un post por su ID
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
    getPostById,
    getPostByTitle,
    getAllPosts,
    updatePostById,
};