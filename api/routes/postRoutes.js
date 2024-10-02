const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Definir las rutas para la API de posts
router.post('/posts', postController.createPost); // Crear un nuevo post
router.get('/posts/:post_id', postController.getPostById); // Obtener un post por su ID
router.get('/posts/title/:title', postController.getPostByTitle); // Obtener un post por su título
router.put('/posts/:post_id', postController.updatePostById); // Modificar un post por su ID
router.get('/posts', postController.getAllPosts); // Obtener todos los posts

module.exports = router;