const partnerController = require('../controllers/partnerController');
const express = require('express');
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const router = express.Router();

const zazil_partners_path = process.env.zazil_partners_path;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, zazil_partners_path);
    },
    filename: (req, file, cb) => {
        const { first_name, last_name } = req.body;
        if (!first_name || !last_name) {
            return cb(new Error('First name and last name are required'), null);
        }
        let pro_pic = `${first_name}_${last_name}`;
        pro_pic = pro_pic.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        pro_pic = pro_pic.replace(/\s+/g, '-').toLowerCase();
        pro_pic = pro_pic.replace(/[^a-z0-9\-]/g, ''); // Eliminar caracteres especiales restantes
        const ext = path.extname(file.originalname);
        cb(null, `${moment(Date.now()).format("DD-MM-YYYY")}_${pro_pic}${ext}`);
    },
});

const upload = multer({ storage });

// Definir las rutas para la API de socios
router.post('/partners', upload.single('profile_pic'), partnerController.createPartner); // Crear un nuevo socio con carga de imagen
router.get('/partners', partnerController.getPartners); // Obtener todos los socios
router.get('/partners/email/:email', partnerController.getPartnerByEmail); // Obtener un socio por su correo electrónico
router.put('/partners/email/:email', upload.single('profile_pic'), partnerController.updatePartnerByEmail); // Actualizar un socio por su correo electrónico
router.put('/partners/email/:email/account_status', partnerController.updatePartnerAccountStatusByEmail); // Cambiar el estado de la cuenta de un socio por su correo electrónico
router.delete('/partners/email/:email', partnerController.deletePartnerByEmail); // Eliminar un socio por su correo electrónico

module.exports = router;