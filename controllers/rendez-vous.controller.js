import RendezVous from "../models/rendez-vous.js";

export async function getAll(req, res) {
    try {
        const rendezVous = await RendezVous.find().populate('medecin patient');
        return res.status(200).json(rendezVous);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function add(req, res) {
    try {
        const newRendezVous = new RendezVous(req.body);
        const savedRendezVous = await newRendezVous.save();
        return res.status(200).json(savedRendezVous);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function update(req, res) {
    try {
        const updatedRendezVous = await RendezVous.findByIdAndUpdate(req.body._id, req.body, {new: true});
        if (!updatedRendezVous) {
            return res.status(404).json({message: "Rendez-vous not found"});
        }
        return res.status(200).json(updatedRendezVous);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function remove(req, res) {
    try {
        const deletedRendezVous = await RendezVous.findByIdAndDelete(req.query._id);
        if (!deletedRendezVous) {
            return res.status(404).json({message: "Rendez-vous not found"});
        }
        return res.status(200).json({message: "Rendez-vous deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
