const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const zazil_partners_path = process.env.zazil_partners_path;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, zazil_partners_path);
    },
    filename: (req, file, cb) => {
        const { first_name, last_name } = req.body;
        const ext = path.extname(file.originalname);
        cb(null, `${first_name}_${last_name}${ext}`);
    },
});

const upload = multer({ storage });

// Definir las rutas para la API de socios
router.post('/partners', upload.single('profile_pic'), partnerController.createPartner); // Crear un nuevo socio con carga de imagen
router.get('/partners', partnerController.getPartners); // Obtener todos los socios
router.get('/partners/:partner_id', partnerController.getPartnerById); // Obtener un socio por su ID
router.get('/partners/email/:email', partnerController.getPartnerByEmail); // Obtener un socio por su correo electrónico
router.put('/partners/email/:email', upload.single('profile_pic'), partnerController.updatePartnerByEmail); // Actualizar un socio por su correo electrónico
router.put('/partners/email/:email/account_status', partnerController.updatePartnerAccountStatusByEmail); // Cambiar el estado de la cuenta de un socio por su correo electrónico
router.delete('/partners/email/:email', partnerController.deletePartnerByEmail); // Eliminar un socio por su correo electrónico

module.exports = router;