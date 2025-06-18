import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import hikeRoutes from './routes/hikes.js';
import pgclient from './db.js';
import authRoutes from './routes/auth.js';


const app = express();

dotenv.config();

//MiddleWares
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3002;


//Routes

app.use('/api/hikes', hikeRoutes);
app.use('/api/auth', authRoutes);



//localhost:3001/test
app.get("/test", (req,res)=>{
    res.send("tesst route");
})





app.use((req, res)=>{
    res.json({message: "route not found"});
})

pgclient.connect()
    .then (()=>{
        app.listen(PORT, ()=>{
            console.log(`Lestining on port ${PORT}`);
        })
}).catch((error=> {
    console.log('error connecting to the DB');
    console.log(error);
}))
