import dotenv from 'dotenv';

import express from 'express';
import connectMongoDB from './lib/mongoose.js';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.js';
import medecinRoutes from './routes/medecin.route.js';
import patientRoutes from './routes/patient.route.js';
import dossierMedicalRoutes from './routes/dossier-medical.route.js';
import rendezVousRoutes from './routes/rendez-vous.route.js';

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 9001;

dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/medecin', medecinRoutes);
app.use('/patient', patientRoutes);
app.use('/dossier-medical', dossierMedicalRoutes);
app.use('/rendez-vous', rendezVousRoutes);

// Connect to MongoDB
connectMongoDB()
  .then(() => {
    const server = http.createServer(app);

    // Attach WebSocket server to the HTTP server
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.emit("me", socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.broadcast.emit("callEnded");
      });

      socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name})
      })

      socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
      })
    });


    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
