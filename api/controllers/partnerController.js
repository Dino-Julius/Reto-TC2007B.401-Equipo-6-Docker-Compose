const partnerModel = require('../models/partnerModel');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const { BASE_URL, zazil_partners_path, relative_zazil_partners_path } = process.env;

/**
 * Crear un nuevo socio
 */
const createPartner = async (req, res) => {
    const partnerData = req.body;

    if (partnerData.email) {
        partnerData.email = partnerData.email.toLowerCase();
        partnerData.email = partnerData.email.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    if (req.file) {
        partnerData.profile_pic = `${relative_zazil_partners_path}${req.file.filename}`;
    } else {
        userData.profile_pic = `${relative_zazil_partners_path}default_profile_pic.jpg`;
    }
    try {
        const {first_name, last_name, birth_date} = partnerData;
        let rawPassword = `${first_name}${last_name}${birth_date}`;
        rawPassword = rawPassword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        rawPassword = rawPassword.replace(/\s+/g, '-').toLowerCase();
        rawPassword = rawPassword.replace(/[^a-z0-9\-]/g, '');

        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        partnerData.password = hashedPassword;

        const newPartner = await partnerModel.createPartner(partnerData);
        newPartner.birth_date = moment(newPartner.birth_date).format('DD-MM-YYYY');
        newPartner.profile_pic = newPartner.profile_pic ? `${BASE_URL}${newPartner.profile_pic}` : null;
        res.status(201).json({
            success: true,
            message: 'Socio creado correctamente',
            partner: newPartner
        });
    } catch (error) {
        if (req.file) {
            const fullPath = path.join(zazil_partners_path, path.basename(partnerData.profile_pic));
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });
        }
        console.error('Error al crear el socio:', error);
        console.log(partnerData);
        res.status(500).json({
            success: false,
            error: 'Error al crear el socio',
            partner: null
        });
    }
};

/**
 * Obtener todos los socios
 */
const getPartners = async (_req, res) => {
    try {
        const partners = await partnerModel.getPartners();
        const formattedPartners = partners.map(partner => ({
            ...partner,
            birth_date: moment(partner.birth_date).format('DD-MM-YYYY'),
            profile_pic: partner.profile_pic ? `${BASE_URL}${partner.profile_pic}` : null
        }));
        res.status(200).json(formattedPartners);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los socios' });
    }
};

/**
 * Obtener un socio por su correo electrónico
 */
const getPartnerByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const partner = await partnerModel.getPartnerByEmail(email);
        if (partner) {
            partner.birth_date = moment(partner.birth_date).format('DD-MM-YYYY');
            partner.profile_pic = partner.profile_pic ? `${BASE_URL}${partner.profile_pic}` : null;
            res.status(200).json(partner);
        } else {
            res.status(404).json({ error: 'Socio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el socio' });
    }
};

/**
 * Controlador para actualizar un socio por su correo electrónico
 */
const updatePartnerByEmail = async (req, res) => {
    const { email } = req.params;
    const partnerData = req.body;

    try {
        const partner = await partnerModel.getPartnerByEmail(email);
        if (!partner) {
            return res.status(404).json({ error: "Socio no encontrado" });
        }

        // Convertir account_status a booleano
        if (partnerData.account_status) {
            partnerData.account_status = partnerData.account_status === 'enabled';
        }

        // Si se recibe un archivo, actualizar la imagen de perfil
        if (req.file) {
            partnerData.profile_pic = `${relative_zazil_partners_path}${req.file.filename}`;
            // Eliminar la imagen anterior si no es la imagen por defecto
            if (partner.profile_pic && partner.profile_pic !== `${relative_zazil_partners_path}default_profile_pic.jpg`) {
                const fullPath = path.join(zazil_partners_path, path.basename(partner.profile_pic));
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar el archivo:", err);
                    }
                });
            }
        } else {
            partnerData.profile_pic = partner.profile_pic;
        }

        // Actualizar solo los campos recibidos en el cuerpo de la solicitud
        const updatedPartner = await partnerModel.updatePartnerByEmail(email, partnerData);
        updatedPartner.birth_date = moment(updatedPartner.birth_date).format("DD-MM-YYYY");
        updatedPartner.profile_pic = updatedPartner.profile_pic
            ? `${BASE_URL}${updatedPartner.profile_pic}`
            : null;

        res.status(200).json(updatedPartner);
    } catch (error) {
        console.error("Error al actualizar el socio:", error);
        res.status(500).json({ error: "Error al actualizar el socio" });
    }
};

/**
 * Cambiar el estado de la cuenta de un socio por su correo electrónico
 */
const updatePartnerAccountStatusByEmail = async (req, res) => {
    const { email } = req.params;
    const { account_status } = req.body;
    try {
        const updatedPartner = await partnerModel.updatePartnerAccountStatusByEmail(email, account_status);
        if (updatedPartner) {
            res.status(200).json({
                
            });
        } else {
            res.status(404).json({ error: 'Socio no encontrado' });
        }
    } catch (error) {
        console.error('Error al cambiar el estado de la cuenta del socio:', error)
        res.status(500).json({ error: 'Error al cambiar el estado de la cuenta del socio' });
    }
};

/**
 * Eliminar un socio por su correo electrónico
 */
const deletePartnerByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const partner = await partnerModel.getPartnerByEmail(email);
        if (!partner) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        const deletedPartner = await partnerModel.deletePartnerByEmail(email);
        if (deletedPartner) {
            // Eliminar la foto de perfil si no es la imagen por defecto
            const profilePicPath = path.join(process.env.zazil_partners_path, path.basename(partner.profile_pic));
            if (partner.profile_pic && path.basename(partner.profile_pic) !== 'default_profile_pic.jpg') {
                fs.unlink(profilePicPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar la foto de perfil:', err);
                    }
                });
            }
            res.status(200).json(deletedPartner);
        } else {
            res.status(404).json({ error: 'Socio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el socio' });
    }
};

module.exports = {
    createPartner,
    getPartners,
    getPartnerByEmail,
    updatePartnerByEmail,
    updatePartnerAccountStatusByEmail,
    deletePartnerByEmail,
};