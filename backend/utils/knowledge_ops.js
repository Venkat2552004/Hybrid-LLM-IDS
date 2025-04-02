import { Event, WatchList, BlockedList} from "./mongo_schema_builder.js"
import { run } from "../gemini.js"
import dotenv from 'dotenv'

dotenv.config()

class MongoQ {
    async addEvent(eventData) {
        try{
            const event = new Event(eventData)
            console.log(eventData)
            await event.save()
            return event
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async addLlmReason(llmData, eventId) {
        console.log('From addLlmReason: ', llmData)
        console.log('From addLlmReason: ', eventId)
        llmData = JSON.stringify(llmData)
        try{
            console.log('Updating event with LLM reasoning')
            // find by id and update
            const updatedEvent = await Event.findByIdAndUpdate
            (eventId, {llm_reasoning: llmData}, {new: true})
        }
        catch (error) {
            console.log(error)
            return error
        }
    }
    async removeEvent(eventId) {
        try{
            const event = await Event.findByIdAndDelete(eventId)
            return event
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async getEvents(n){
        try{
            const events = await Event.find().sort({timestamp: -1}).limit(n)
            return events
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async getAllEvents(){
        try{
            const events = await Event.find()
            return events
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async getSpecificEvent(eventId, ip){
        try{
            const event = await Event.findOne({$or: [{_id: eventId}, {ip: ip}]})
            return event
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async getAllEvents(eventId, ip){
        try{
            const events = await Event.find({$or: [{_id: eventId}, {ip: ip}]})
            return events
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async addWatchList(watchListData) {
        try{
            const watchList = await WatchList.findOne({
                ip: watchListData.ip
            })
            if(watchList){
                const updatedWatchList = await WatchList.findOneAndUpdate({ip: watchListData.ip}, {count: watchList.count + 1, lastSeen: Date.now(), active: true})
                return updatedWatchList
            } else {
                const watchList = new WatchList(watchListData)
                await watchList.save()
                return watchList
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async removeWatchList(ip) {
        try{
            const watchList = await WatchList.findOneAndUpdate({ip: ip}, {active: false})
            return watchList
        }
        catch (error) {
            console.log(error)
            return error
        }
    }
    async checkWatchListActive(ip) {
        try{
            const watchList = await WatchList.findOne({ip: ip, active: true})
            return watchList
        }
        catch (error) {
            console.log(error)
            return error
        }
    }

    async addBlockedList(blockedListData) {
        try{
            const blockedList = await BlockedList.findOne({
                ip: blockedListData.ip
            })
            if(blockedList){
                const updatedBlockedList = await BlockedList.findOneAndUpdate({ip: blockedListData.ip}, {count: blockedList.count + 1, lastBlocked: Date.now()})
                return updatedBlockedList
            } else {
                const blockedList = new BlockedList(blockedListData)
                await blockedList.save()
                return blockedList
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async removeBlockedList(ip) {
        try{
            const blockedList = await BlockedList.updateOne({ip: ip}, {active: false})
            return blockedList
        }
        catch (error) {
            console.log(error)
            return error
        }
    }
    async checkBlockedListActive(ip) {
        try{
            const blockedList = await BlockedList.findOne({ip: ip, active: true})
            return blockedList
        }
        catch (error) {
            console.log(error)
            return error
        }
    }
}

export { MongoQ }