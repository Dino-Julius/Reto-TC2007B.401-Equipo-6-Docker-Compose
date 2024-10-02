const express = require('express');
const multer = require('multer');
const router = express.Router();
const postController = require('../controllers/postController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/usr/share/nginx/html/media/zazil_posts');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Definir las rutas para la API de posts
router.post('/posts', upload.single('file_path'), postController.createPost); // Crear un nuevo post con carga de archivo
router.get('/posts/:post_id', postController.getPostById); // Obtener un post por su ID
router.get('/posts/title/:title', postController.getPostByTitle); // Obtener un post por su título
router.put('/posts/:post_id', upload.single('file_path'), postController.updatePostById); // Modificar un post por su ID con carga de archivo
router.get('/posts', postController.getAllPosts); // Obtener todos los posts

module.exports = router;