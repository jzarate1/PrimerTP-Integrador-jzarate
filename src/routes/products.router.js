const express = require('express');
const router = express.Router();
const Producto = require('../models/products.models');
const { requireLogin } = require('../middleware/authMiddleware');

//Ruta GET para obtener los productos
router.get('/products', requireLogin, async (req, res) => {
    try {
        // Obtén todos los productos de la base de datos
        const productos = await Producto.find();

        // Renderiza la vista 'home' y pasa los productos como variable
        res.render('products', { productos });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

//Ruta get para la pagina agregar producto
router.get('/product/add', async(req, res) => {
    res.render('add-product');
});

// Ruta POST para agregar un nuevo producto
router.post('/products', async (req, res) => {
    try {
        const nuevoProducto = req.body; // Aquí asumimos que los datos del nuevo producto se envían en el cuerpo de la solicitud
        
        const productoCreado = await Producto.create(nuevoProducto);
        
        // Redirige al usuario a la página de inicio después de crear el producto
        res.redirect('/products');
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Ruta para mostrar la vista de edición de productos
router.get('/product/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        // Busca el producto en la base de datos por su ID
        const producto = await Producto.findById(productId);

        if (!producto) {
            // Si no se encuentra el producto, puedes manejarlo de acuerdo a tus necesidades
            return res.status(404).send('Producto no encontrado');
        }

        // Renderiza la vista de edición de productos y pasa el producto como variable
        res.render('edit-product', { producto });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

//Ruta para procesar la edición de un producto (POST)
router.post('/product/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { nombre, descripcion, precio, categoria, stock, imagen } = req.body;
        const disponibilidad = req.body.disponible === 'on'; // Convierte el valor a un booleano

        // Busca el producto en la base de datos por su ID y actualiza todas sus propiedades
        const productoActualizado = await Producto.findByIdAndUpdate(
            productId,
            { nombre, descripcion, precio, categoria, stock, imagen, disponibilidad },
            { new: true } // Devuelve el producto actualizado
        );

        if (!productoActualizado) {
            // Si no se encuentra el producto o no se puede actualizar, puedes manejarlo
            return res.status(404).send('Producto no encontrado o no se pudo actualizar');
        }

        // Redirige al usuario a la página de detalles del producto actualizado
        res.redirect(`/product/edit/${productoActualizado._id}`);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

module.exports = router;
