 const express = require ('express')
const mongoose = require('mongoose')
const cors =require ('cors')
const dotenv = require('dotenv')
dotenv.config()
const app =express()
const nodemailer = require('nodemailer')
app.use(express.json());
 
app.use(cors());


 console.log('MONGO_URI:', process.env.MONGO_URI);

  mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the user schema
 
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  message:{type: String,required: true}
});
 

const UserModel = mongoose.model('emails',userSchema)


 app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Save to MongoDB
    await UserModel.create({ name, email, message });
    console.log('User data saved to DB');

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: 'kingsblog9ja@gmail.com',
      subject: `New Contact Message from ${name}`,
      text: `${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.log(error)
        console.error('Email sending error:', error);
        return res.status(500).json({ message: 'Email failed' });
        
      }
      res.status(200).json({ message: 'Email sent and user saved successfully' });
    });
  } catch (err) {
    console.error('DB Save or email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





app.listen(3000,()=>{
    console.log('server up and runing ,port 3000')
})


 