import DossierMedical from "../models/dossier-medical.js";

export async function getAll(req, res) {
    try {
        const medicalRecords = await DossierMedical.find().populate('patient');
        return res.status(200).json(medicalRecords);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function add(req, res) {
    try {
        const newMedicalRecord = new DossierMedical(req.body);
        const savedMedicalRecord = await newMedicalRecord.save();
        return res.status(200).json(savedMedicalRecord);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function update(req, res) {
    try {
        const updatedMedicalRecord = await DossierMedical.findByIdAndUpdate(req.body._id, req.body, {new: true});
        if (!updatedMedicalRecord) {
            return res.status(404).json({message: "Medical record not found"});
        }
        return res.status(200).json(updatedMedicalRecord);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function remove(req, res) {
    try {
        const deletedMedicalRecord = await DossierMedical.findByIdAndDelete(req.query._id);
        if (!deletedMedicalRecord) {
            return res.status(404).json({message: "Medical record not found"});
        }
        return res.status(200).json({message: "Medical record deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
