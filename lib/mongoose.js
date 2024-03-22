import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        //
            await mongoose.connect("mongodb+srv://salahbounouh:Pdl32E3wfqen6kbt@cluster0.ujzb6iy.mongodb.net/cabinet");
            console.log("Connected to MongoDB");
            return true; 
        //}
        //return false;
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        return false;
    }
}

export default connectMongoDB;