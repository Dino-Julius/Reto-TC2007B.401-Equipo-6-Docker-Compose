const fs = require("fs");
const path = require("path");
const productModel = require("../models/productModel");

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const productData = req.body;
  if (req.file) {
    productData.image_path = `/media/zazil_products/${req.file.filename}`; // Ruta relativa que Nginx servirá
  }
  try {
    const newProduct = await productModel.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
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
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Obtener un producto por su SKU
const getProductBySku = async (req, res) => {
  const { sku } = req.params;
  try {
    const product = await productModel.getProductBySku(sku);
    if (product) {
      // Asegúrate de que la URL de la imagen esté incluida en la respuesta
      product.imageUrl = `http://localhost${product.image_path}`;
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// TODO: Implementar que la función updateProductBySku elimine la imagen anterior si se sube una nueva imagen
// Actualizar un producto por su SKU
const updateProductBySku = async (req, res) => {
  const { sku } = req.params;
  const productData = req.body;
  if (req.file) {
    productData.image_path = `/media/zazil_products/${req.file.filename}`; // Ruta relativa que Nginx servirá
  }
  try {
    const updatedProduct = await productModel.updateProductBySku(
      sku,
      productData
    );
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al crear el post" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductBySku,
  updateProductBySku,
};
