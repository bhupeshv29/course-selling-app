import 'dotenv/config'
import fetch from 'node-fetch';

import express from 'express'
import mongoose from 'mongoose'
import { userRouter } from './routes/user.js';
import { courseRouter } from './routes/course.js';
import { adminRouter } from './routes/admin.js';

import cors from 'cors'

const app  = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);    
    app.listen(3000);
    console.log("listening on port 3000");

    setInterval(() => {
        fetch('https://course-selling-app-woad.vercel.app/')
            .then(res => console.log('Keep-alive ping successful'))
            .catch(err => console.error('Keep-alive ping failed:', err));
    }, 5 * 60 * 1000); // Ping every 5 minutes
}

main()
