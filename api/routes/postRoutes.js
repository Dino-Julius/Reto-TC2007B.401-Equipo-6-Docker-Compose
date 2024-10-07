const postController = require('../controllers/postController');
const express = require('express');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const router = express.Router();
const zazil_posts_path = process.env.zazil_posts_path;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, zazil_posts_path);
    },
    filename: (req, file, cb) => {
        let { title } = req.body;
        title = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        title = title.replace(/\s+/g, '-').toLowerCase();
        title = title.replace(/[^a-z0-9\-]/g, ''); // Eliminar caracteres especiales restantes
        const ext = path.extname(file.originalname);
        cb(null, `${moment(Date.now()).format('DD-MM-YYYY')}_${title}${ext}`);
    }
});

const upload = multer({ storage });

// Definir las rutas para la API de posts
router.post('/posts', upload.fields([{ name: 'file_path' }, { name: 'image_path' }]), postController.createPost); // Crear un nuevo post con carga de archivo e imagen
router.get('/posts', postController.getPosts); // Obtener todos los posts
router.get('/posts/:post_id', postController.getPostById); // Obtener un post por su ID
router.get('/posts/title/:title', postController.getPostByTitle); // Obtener un post por su título
router.get('/posts/partner/:partner_id', postController.getPostsByPartnerId); // Obtener todos los posts de un socio por su partner_id
router.put('/posts/:post_id', upload.fields([{ name: 'file_path' }, { name: 'image_path' }]), postController.updatePostById); // Modificar un post por su ID con carga de archivo e imagen
router.delete('/posts/:post_id', postController.deletePostById); // Eliminar un post por su ID

module.exports = router;