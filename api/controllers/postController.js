const postModel = require('../models/postModel');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL;
const zazil_posts_path = process.env.zazil_posts_path;
const relative_zazil_posts_path = process.env.relative_zazil_posts_path;

/**
 * Crear un nuevo post
 */
const createPost = async (req, res) => {
    const postData = req.body;
    if (req.files['file_path'] && req.files['image_path']) {
        postData.file_path = `${relative_zazil_posts_path}${req.files['file_path'][0].filename}`;
        postData.image_path = `${relative_zazil_posts_path}${req.files['image_path'][0].filename}`;
    }
    try {
        const newPost = await postModel.createPost(postData);
        newPost.date = moment(newPost.date).format('DD-MM-YYYY');
        newPost.file_path = newPost.file_path ? `${BASE_URL}${newPost.file_path}` : null;
        newPost.image_path = newPost.image_path ? `${BASE_URL}${newPost.image_path}` : null;
        res.status(201).json(newPost);
    } catch (error) {
        /**
         * Eliminar archivos si hay error
         */
        if (req.files['file_path'] && req.files['image_path']) {
            const file_fullPath = path.join(zazil_posts_path, req.files['file_path'][0].filename);
            fs.unlink(file_fullPath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });
            const image_fullPath = path.join(zazil_posts_path, req.files['image_path'][0].filename);
            fs.unlink(image_fullPath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });
        }
        console.error('Error al crear el post:', error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
};

/**
 * Obtener todos los posts
 */
const getPosts = async (req, res) => {
    try {
        const posts = await postModel.getPosts();
        const formattedPosts = posts.map(post => ({
            ...post,
            date: moment(post.date).format('DD-MM-YYYY'),
            file_path: post.file_path ? `${BASE_URL}${post.file_path}` : null,
            image_path: post.image_path ? `${BASE_URL}${post.image_path}` : null,
        }));
        res.status(200).json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
};

/**
 * Obtener un post por su ID
 */
const getPostById = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await postModel.getPostById(post_id);
        if (post) {
            post.date = moment(post.date).format('DD-MM-YYYY');
            post.file_path = post.file_path ? `${BASE_URL}${post.file_path}` : null;
            post.image_path = post.image_path ? `${BASE_URL}${post.image_path}` : null;
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el post' });
    }
};

/**
 * Obtener un post por su título
 */
const getPostByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const post = await postModel.getPostByTitle(title);
        if (post) {
            post.date = moment(post.date).format('DD-MM-YYYY');
            post.file_path = post.file_path ? `${BASE_URL}${post.file_path}` : null;
            post.image_path = post.image_path ? `${BASE_URL}${post.image_path}` : null;
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el post' });
    }
};

/**
 * Obtener todos los posts de un socio por su partner_id
 */
const getPostsByPartnerId = async (req, res) => {
    const { partner_id } = req.params;
    try {
        const posts = await postModel.getPostsByPartnerId(partner_id);
        if (posts.length > 0) {
            const formattedPost = posts.map((post) => ({
              ...post,
              date: moment(post.date).format('DD-MM-YYYY'),
              file_path: post.file_path ? `${BASE_URL}${post.file_path}` : null,
              image_path: post.image_path ? `${BASE_URL}${post.image_path}` : null,
            }));
            res.status(200).json(formattedPost);
        } else {
            res.status(404).json({ error: 'No se encontraron posts para este socio' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
};

/**
 * Actualizar un post por su ID
 */
const updatePostById = async (req, res) => {
    const { post_id } = req.params;
    const postData = req.body;
    try {
        const post = await postModel.getPostById(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }
        if(req.files['file_path'] && req.files['image_path']) {
            postData.file_path = `${relative_zazil_posts_path}${req.files['file_path'][0].filename}`;
            postData.image_path = `${relative_zazil_posts_path}${req.files['image_path'][0].filename}`;
            const updatedPost = await postModel.updatePostById(post_id, postData);
            if (updatedPost) {
                const file_fullPath = path.join(zazil_posts_path, path.basename(post.file_path));
                fs.unlink(file_fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    }
                });

                const image_fullPath = path.join(zazil_posts_path, path.basename(post.image_path));
                fs.unlink(image_fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    }
                });
            }
            updatedPost.date = moment(updatedPost.date).format('DD-MM-YYYY');
            updatedPost.file_path = updatedPost.file_path ? `${BASE_URL}${updatedPost.file_path}` : null;
            updatedPost.image_path = updatedPost.image_path ? `${BASE_URL}${updatedPost.image_path}` : null;
            res.status(200).json(updatedPost);
        } else {
            postData.file_path = post.file_path;
            postData.image_path = post.image_path;
            const updatedPost = await postModel.updatePostById(post_id, postData);
            const formattedPost = updatedPost.map((post) => ({
              ...post,
                date: moment(post.date).format('DD-MM-YYYY'),
              file_path: post.file_path ? `${BASE_URL}${post.file_path}` : null,
              image_path: post.image_path ? `${BASE_URL}${post.image_path}` : null,
            }));
            res.status(200).json(formattedPost);
        }
    } catch (error) {
        console.error('Error al actualizar el post:', error);
        res.status(500).json({ error: 'Error al actualizar el post' });
    }
};

/**
 * Función para eliminar un post por su ID
 */
const deletePostById = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await postModel.getPostById(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }
        /**
         * Eliminar archivos asociados
         */
        const file_fullPath = path.join(zazil_posts_path, path.basename(post.file_path));
        const image_fullPath = path.join(zazil_posts_path, path.basename(post.image_path));
        fs.unlink(file_fullPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            }
        });
        fs.unlink(image_fullPath, (err) => {
            if (err) {
                console.error('Error al eliminar la imagen:', err);
            }
        });
        const deletedPost = await postModel.deletePostById(post_id);
        deletedPost.date = moment(deletedPost.date).format('DD-MM-YYYY');
        deletedPost.file_path = deletedPost.file_path ? `${BASE_URL}${deletedPost.file_path}` : null;
        deletedPost.image_path = deletedPost.image_path ? `${BASE_URL}${deletedPost.image_path}` : null
        res.status(200).json(deletedPost);
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostByTitle,
    getPostsByPartnerId,
    updatePostById,
    deletePostById
};