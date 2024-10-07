const partnerModel = require('../models/partnerModel');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL;
const zazil_partners_path = process.env.zazil_partners_path;
const relative_zazil_partners_path = process.env.relative_zazil_partners_path;

/**
 * Crear un nuevo socio
 */
const createPartner = async (req, res) => {
    const partnerData = req.body;
    if (req.file) {
        partnerData.profile_pic = `${relative_zazil_partners_path}${partnerData.first_name}_${partnerData.last_name}${path.extname(req.file.originalname)}`;
    }
    try {
        const newPartner = await partnerModel.createPartner(partnerData);
        newPartner.birth_date = moment(newPartner.birth_date).format('YYYY-MM-DD');
        newPartner.profile_pic = newPartner.profile_pic ? `${BASE_URL}${newPartner.profile_pic}` : null;
        res.status(201).json(newPartner);
    } catch (error) {
        if (req.file) {
            const fullPath = path.join(zazil_partners_path, path.basename(partnerData.profile_pic));
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });
        }
        res.status(500).json({ error: 'Error al crear el socio' });
    }
};

/**
 * Obtener todos los socios
 */
const getPartners = async (req, res) => {
    try {
        const partners = await partnerModel.getPartners();
        const formattedPartners = partners.map(partner => ({
            ...partner,
            birth_date: moment(partner.birth_date).format('YYYY-MM-DD'),
            profile_pic: partner.profile_pic ? `${BASE_URL}${partner.profile_pic}` : null
        }));
        res.status(200).json(formattedPartners);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los socios' });
    }
};

/**
 * Obtener un socio por su ID
 */
const getPartnerById = async (req, res) => {
    const { partner_id } = req.params;
    try {
        const partner = await partnerModel.getPartnerById(partner_id);
        if (partner) {
            partner.birth_date = moment(partner.birth_date).format('YYYY-MM-DD');
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
 * Obtener un socio por su correo electrónico
 */
const getPartnerByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const partner = await partnerModel.getPartnerByEmail(email);
        if (partner) {
            partner.birth_date = moment(partner.birth_date).format('YYYY-MM-DD');
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
 * Actualizar un socio por su correo electrónico
 */
const updatePartnerByEmail = async (req, res) => {
    const { email } = req.params;
    const partnerData = req.body;
    try {
        const partner = await partnerModel.getPartnerByEmail(email);
        if (!partner) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        if (req.file) {
            partnerData.profile_pic = `${relative_zazil_partners_path}${partnerData.first_name}_${partnerData.last_name}${path.extname(req.file.originalname)}`;
            const updatedPartner = await partnerModel.updatePartnerByEmail(email, partnerData);
            if (updatedPartner) {
                const fullPath = path.join(zazil_partners_path, path.basename(partner.profile_pic));
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    } else {
                        console.log(`Archivo ${fullPath} eliminado`);
                    }
                });
            }
            updatedPartner.birth_date = moment(updatedPartner.birth_date).format('YYYY-MM-DD');
            updatedPartner.profile_pic = updatedPartner.profile_pic ? `${BASE_URL}${updatedPartner.profile_pic}` : null;
            res.status(200).json(updatedPartner);
        } else {
            partnerData.profile_pic = partner.profile_pic;
            const updatedPartner = await partnerModel.updatePartnerByEmail(email, partnerData);
            updatedPartner.birth_date = moment(updatedPartner.birth_date).format('YYYY-MM-DD');
            updatedPartner.profile_pic = updatedPartner.profile_pic ? `${BASE_URL}${updatedPartner.profile_pic}` : null;
            res.status(200).json(updatedPartner);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el socio' });
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
            res.status(200).json(updatedPartner);
        } else {
            res.status(404).json({ error: 'Socio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar el estado de la cuenta del socio' });
    }
};

/**
 * Eliminar un socio por su correo electrónico
 */
const deletePartnerByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const deletedPartner = await partnerModel.deletePartnerByEmail(email);
        if (deletedPartner) {
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
    getPartnerById,
    getPartnerByEmail,
    updatePartnerByEmail,
    updatePartnerAccountStatusByEmail,
    deletePartnerByEmail,
};