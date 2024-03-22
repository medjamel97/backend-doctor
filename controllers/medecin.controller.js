import bcrypt from "bcrypt";
import Bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Medecin from "../models/medecin.js";
import Jwt from "jsonwebtoken";

export async function getAll(req, res) {
    try {
        return res.status(200).json(await Medecin.find());
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export async function register(req, res) {
    const {fName, lName, email, password, address, phoneNbr, specialization, yearsOfExperience} = req.body;

    if (await Medecin.findOne({email}).select("-password")) {
        return res.status(400).json({message: "User already exists!"});
    } else {
        const newMedecin = new Medecin({
            fName,
            lName,
            email,
            password: await bcrypt.hash(password, 10),
            address,
            phoneNbr,
            specialization,
            yearsOfExperience,
        });

        try {
            const savedMedecin = await newMedecin.save();

            return res.status(200).json(savedMedecin);
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
}

export async function login(req, res) {
    const {email, password} = req.body;

    const medecin = await Medecin.findOne({email});

    if (medecin) {
        if (await Bcrypt.compare(password, medecin.password)) {

            return res.status(200).json(medecin);
        } else {
            return res.status(400).json({message: "Invalid credentials"});
        }
    } else {
        return res.status(400).json({message: "Account doesn't exist"});
    }
}

export async function forgotPassword(req, res) {
    const user = await Medecin.findOne({email: req.body.email}).select("-password");

    if (user) {
        const randomNumber = randomIntBetween(1000, 9999);

        const success = await sendEmail({
            from: process.env.GMAIL_USER,
            to: req.body.email,
            subject: "Password reset - Kitebi",
            html:
                "<h3>You have requested to reset your password</h3><p>Your reset code is : <b style='color : #7b2bf1'>" +
                randomNumber +
                "</b></p>",
        }).catch((error) => {
            console.log(error)
            return res.status(400).json({message: "Email could not be sent"});
        });

        // token creation
        const token = await generateResetToken(randomNumber, req.body.email)

        if (success) {
            return res.status(200).json(token);
        } else {
            return res.status(400).json({message: "Email could not be sent"});
        }
    } else {
        return res.status(400).json({message: "User does not exist"});
    }
}

export async function verifyResetCode(req, res) {
    let {resetCode, token} = req.body

    let verifiedToken
    try {
        verifiedToken = Jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Could not verify code"})
    }

    if (String(verifiedToken.resetCode) === resetCode) {
        return res.status(200).json({message: "Success"});
    } else {
        return res.status(400).json({message: "Incorrect reset code"});
    }
}

export async function resetPassword(req, res) {
    let {token, plainPassword} = req.body

    let verifiedToken
    try {
        verifiedToken = Jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Could not verify code"})
    }

    try {
        await Medecin.findOneAndUpdate({email: verifiedToken.email},
            {
                $set: {
                    password: await Bcrypt.hash(plainPassword, 10),
                },
            }
        )
        return res.status(200).json({message: "Success"});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

async function sendEmail(mailOptions) {
    let transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    await transporter.verify(function (error) {
        if (error) {
            console.log(error);
            console.log("Server not ready");
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log("Email sent: " + info.response);
            return true;
        }
    });

    return true;
}

function generateResetToken(resetCode, email) {
    console.log(resetCode, email)
    return Jwt.sign(
        {resetCode, email},
        process.env.JWT_SECRET,
        {expiresIn: "100000000"},// in Milliseconds (3600000 = 1 hour)
    )
}

function randomIntBetween(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
