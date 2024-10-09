const productModel = require('../models/productModel');
const path = require('path');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL;
const zazil_products_path = process.env.zazil_products_path;
const relative_zazil_products_path = process.env.relative_zazil_products_path;

/**
 * Crear un nuevo producto
 */
const createProduct = async (req, res) => {
    const productData = req.body;
    if (req.file) {
        productData.image_path = `${relative_zazil_products_path}${req.file.filename}`;
    }
    try {
        const newProduct = await productModel.createProduct(productData);
        newProduct.image_path = newProduct.image_path ? `${BASE_URL}${newProduct.image_path}` : null;
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        // Eliminar el archivo si hubo un error al crear el producto
        if (req.file) {
            const fullPath = path.join(zazil_products_path, req.file.filename);
            console.log(fullPath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });
        }
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

/**
 * Obtener todos los productos
 */
const getProducts = async (req, res) => {
    try {
        const products = await productModel.getProducts();
        const formattedProducts = products.map(product => ({
            ...product, 
            image_path: product.image_path ? `${BASE_URL}${product.image_path}` : null
        }));
        res.status(200).json(formattedProducts);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

/**
 * Obtener un producto por su SKU
 */
const getProductBySku = async (req, res) => {
    const { sku } = req.params;
    try {
        const product = await productModel.getProductBySku(sku);
        if (product) {
            product.image_path = product.image_path ? `${BASE_URL}${product.image_path}` : null;
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Obtener todos los productos habilitados
const getEnabledProducts = async (req, res) => {
    try {
        const products = await productModel.getEnabledProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener los productos habilitados:', error);
        res.status(500).json({ error: 'Error al obtener los productos habilitados' });
    }
};

/**
 * Actualizar un producto por su SKU
 */
const updateProductBySku = async (req, res) => {
    const { sku } = req.params;
    const productData = req.body;
    try {
        const product = await productModel.getProductBySku(sku);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (req.file) {
            productData.image_path = `${relative_zazil_products_path}${req.file.filename}`;
            const updatedProduct = await productModel.updateProductBySku(sku, productData);
            if (updatedProduct) {
                const fullPath = path.join(zazil_products_path, path.basename(product.image_path));
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    }
                });
            }
            updatedProduct.image_path = updatedProduct.image_path ? `${BASE_URL}${updatedProduct.image_path}` : null;
            res.status(200).json(updatedProduct);
        } else {
            productData.image_path = product.image_path;
            const updatedProduct = await productModel.updateProductBySku(sku, productData);
            updatedProduct.image_path = updatedProduct.image_path ? `${BASE_URL}${updatedProduct.image_path}` : null;
            res.status(200).json(updatedProduct);
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Habilitar/Deshabilitar un producto por su SKU
const toggleProductStatusBySku = async (req, res) => {
    const { sku } = req.params;
    const { status } = req.body;
    try {
        const updatedProduct = await productModel.toggleProductStatusBySku(sku, status);
        if (updatedProduct) {
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del producto:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del producto' });
    }
};

/**
 * Eliminar un producto por su SKU
 */
const deleteProductBySku = async (req, res) => {
    const { sku } = req.params;
    try {
        const product = await productModel.getProductBySku(sku);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const deletedProduct = await productModel.deleteProductBySku(sku);
        if (deletedProduct) {
            if (deletedProduct.image_path) {
                const fullPath = path.join(zazil_products_path, path.basename(deletedProduct.image_path));
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    } else {
                        console.log(`Archivo ${fullPath} eliminado`);
                    }
                });
            }
            console.log('Producto eliminado exitosamente:', sku);
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductBySku,
    getEnabledProducts,
    updateProductBySku,
    toggleProductStatusBySku,
    deleteProductBySku,
};