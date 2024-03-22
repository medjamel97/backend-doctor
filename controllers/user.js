import { validationResult } from 'express-validator';
import User from '../models/user.js';
import DossierMedical from '../models/dossier-medical.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function addDoctor(req,res){
    if(!validationResult(req).isEmpty){
        res.status(400).json({error: validationResult(req).array()});
    }
    else{
        User.create({
            fName : req.body.fName,
            lName : req.body.lName,
            email : req.body.email,
            password : req.body.password,
            address : req.body.address,
            phoneNbr : req.body.phoneNbr,
            role:'doctor',
            specialization: req.body.specialization,
            yearsOfExperience: req.body.yearsOfExperience,
        })
        .then((newDoctor) => {
            res.status(201).json({
                "_id" : newDoctor.id
            })
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    }
}


export function addPatient(req,res){
    if(!validationResult(req).isEmpty){
        res.status(400).json({error: validationResult(req).array()});
    }
    else{
        DossierMedical
        .create({
            notes: [`Patient : ${req.body.fName} ${req.body.lName}`]
        })
        .then((newDoc) =>{
            User.create({
                fName : req.body.fName,
                lName : req.body.lName,
                email : req.body.email,
                password : req.body.password,
                address : req.body.address,
                phoneNbr : req.body.phoneNbr,
                role:'patient',
                dateOfBirth: req.body.dateOfBirth,
                medicalHistory: newDoc
            })
            .then((newPatient) => {
                res.status(201).json({
                    "_id" : newPatient.id
                })
            })
            .catch((err) => {
                res.status(500).json(err);
            });
        })
        .catch((err) =>{
            res.status(500).json(err);
        })
    }
}

export async function login(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    } else {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Password is invalid' });
            }

            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.status(200).json({ user, accessToken });
        } catch (err) {
            console.error(err); 
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}



export async function assignPatientToMedecin(req, res) {
    try {
      const doctor = await User.findById(req.params.idPsychologist);
      const patient = await User.findById(req.params.idPatient);
  
      if (!(patient in doctor.patients)) {
        patient.doctors.push(doctor);
        doctor.patients.push(patient);
        await patient.save(); 
        await doctor.save(); 
        res.status(200).json({ message: "Patient assigned to psychologist" });
      } else {
        res.status(400).json({ error: "Patient already seing the docto" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

export async function findAllDoctors(req,res) {
  try {
    const doctors = await User.find({ role: 'doctor' })
        .then((doctors)=>{
            console.log(doctors.fName);
            return res.status(200).json({ doctors});
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
  } catch (error) {
        return res.status(500).json(err);
  }
}

