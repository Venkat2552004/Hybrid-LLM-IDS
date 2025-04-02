import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { run } from '../gemini.js'

dotenv.config()
const uri = process.env.MONGO_URI
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true
        })
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection failed')
        console.error(error)
        process.exit(1)
    }
}

connectDB()

const eventSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	timestamp: { type: String},
	message: { type: String},
	classification: { type: String},
	priority: { type: Number},
	protocol: { type: String },
	src_ip: { type: String},
	src_port: { type: Number},
	dest_ip: { type: String },
	dest_port: { type: Number},
	packet_length: { type: Number },
	ttl: { type: Number },
	tcp_flags: { type: String },
    llm_reasoning: { type: Object, required: false }
})

const watchListSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true},
    reason: { type: String, required: true },
    sevierityScale: { type: Number, required: true },
    timestamp: { type: String, required: true },
    firstSeen: { 
        type: Date,
        default: Date.now
    },
    lastSeen: { 
        type: Date,
        default: Date.now
    },
    count: { type: Number, default: 1 },
    active: { type: Boolean, default: true }
})

const blockedListSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    sevierityScale: { type: Number, required: true },
    firstBlocked: { 
        type: Date,
        default: Date.now
    },
    lastBlocked: { 
        type: Date,
        default: Date.now
    },
    count: { type: Number, default: 1 }
})

watchListSchema.pre('save', function(next) {
    if (this.isModified('ip')) {
        this.lastSeen = new Date()
        if(this.isNew)
            this.count = 1
        else 
            this.count += 1
    }
    next()
})

blockedListSchema.pre('save', function(next) {
    if (this.isModified('ip')) {
        this.lastBlocked = new Date()
        if(this.isNew)
            this.count = 1
        else 
            this.count += 1
    }
    next()
})


const Event = mongoose.model('Event', eventSchema)
const WatchList = mongoose.model('WatchList', watchListSchema)
const BlockedList = mongoose.model('BlockedList', blockedListSchema)

export { Event, WatchList, BlockedList }