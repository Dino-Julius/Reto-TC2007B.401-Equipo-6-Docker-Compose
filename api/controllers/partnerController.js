const partnerModel = require('../models/partnerModel');

// Crear un nuevo socio
const createPartner = async (req, res) => {
    const partnerData = req.body;
    try {
        const newPartner = await partnerModel.createPartner(partnerData);
        res.status(201).json(newPartner);
    } catch (error) {
        console.error('Error al crear el socio:', error);
        res.status(500).json({ error: 'Error al crear el socio' });
    }
};

// Obtener todos los socios
const getAllPartners = async (req, res) => {
    try {
        const partners = await partnerModel.getAllPartners();
        res.status(200).json(partners);
    } catch (error) {
        console.error('Error al obtener los socios:', error);
        res.status(500).json({ error: 'Error al obtener los socios' });
    }
};

// Obtener un socio por su ID
const getPartnerById = async (req, res) => {
    const { partner_id } = req.params;
    try {
        const partner = await partnerModel.getPartnerById(partner_id);
        if (partner) {
            res.status(200).json(partner);
        } else {
            res.status(404).json({ error: 'Socio no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el socio:', error);
        res.status(500).json({ error: 'Error al obtener el socio' });
    }
};

module.exports = {
    createPartner,
    getAllPartners,
    getPartnerById,
};