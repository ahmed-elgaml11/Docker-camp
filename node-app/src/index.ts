import express from 'express'
import dotenv from 'dotenv';
import path from 'path'
import { log } from 'console';
import mongoose from 'mongoose'
dotenv.config({path: path.join(__dirname, '../.env')});
import { createClient } from "redis";
import { Client } from 'pg'


const postgresUrl = `postgresql://root:example@postgres:5432`
const client = new Client({
    connectionString: postgresUrl
})
client
.connect()
.then(() => console.log('connected to postgres'))
.catch((err) => console.log(err)) 

// const redisClient = createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
// })
// redisClient.on("error", (err) => console.log("Redis Client Error", err))
// redisClient.on('connect', () => log('connecting to redis...'))
// redisClient.connect();


const app = express()
// mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`)
// .then(() => {
//     log('connecting to db...')
// }).catch(err => {
//     log (err)
// })

app.get('/', (req, res) => {
    // redisClient.set('products', 'products.....')
    res.send('hi.....')
})
app.get('/data', async (req, res) => {
    // const data = await redisClient.get('products')
    res.json({
        msg: 'fsf',
    })
})



app.get('/hi', (req, res) => {
    res.send('hi hi')
})





const port = process.env.PORT || 4000
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Listening on ${port}`);
})
