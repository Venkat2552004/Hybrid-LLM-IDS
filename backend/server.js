import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import { MongoQ } from './utils/knowledge_ops.js'
import { run } from './gemini.js'

const app = express()
const mq = new MongoQ()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

dotenv.config()

const PORT = process.env.PORT || 5000


app.get('/allEvents', async (req, res) => {
    console.log("Getting all events")
    try{
        const events = await mq.getAllEvents()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

app.post('/addEvent', async (req, res) => {
    console.log(req.body)
    try{
        const event = await mq.addEvent(req.body)
        console.log("Event:", event)
        console.log("Event ID:", event._id)
        const id = event._id
        const llmInput = {...req.body}
        delete llmInput._id
        console.log("ID:", id)
        console.log("LlmInput:", llmInput)
        const llmRes = await run(llmInput, id)
        //update event with llm reasoning
        const updatedEvent = await mq.addLlmReason(llmRes, id)
        res.status(200).send(llmRes)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})