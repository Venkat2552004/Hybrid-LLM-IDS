import {
    GoogleGenerativeAI,
} from "@google/generative-ai"
import fs from "fs"
import dotenv from "dotenv"
import { MongoQ } from "./utils/knowledge_ops.js"
dotenv.config()
const apiKey = process.env.GOOGLE_API_KEY

const genAi = new GoogleGenerativeAI(apiKey)

const model = genAi.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "Provide a concise explanation of the alert, including the type of attack, potential impact, and recommended actions for a security engineer to take. Provide the output in JSON format, with keys \"incident_summary\", \"evidence\", and \"recommendations\". Make sure to add \"references\" when required. Strictly JSON output without beginning or ending ticks (```)",
    // tools: [
    //     {
    //         functionDeclarations: [
    //             {
    //                 name: "getRecentIncidents",
    //                 description: "Get recent incidents from the database when specifically asked for by the user.",
    //                 parameters: [
    //                     {
    //                         name: "n",
    //                         description: "The number of recent incidents to fetch.",
    //                         type: "number"
    //                     }
    //                 ],
    //             },
    //             {
    //                 name: "investigateConnectionHistory",
    //                 description: "Investigate the connection history of an IP address to determine if it is malicious.",
    //                 parameters:{
    //                     type: "object",
    //                     properties: {
    //                         src_ip: {
    //                             type: "string",
    //                             description: "The source IP address to investigate."
    //                         },
    //                         dest_ip: {
    //                             type: "string",
    //                             description: "The destination IP address to investigate."
    //                         },
    //                         n: {
    //                             type: "number",
    //                             description: "The number of recent incidents to fetch to be determined by the system automatically."
    //                         }
    //                     },
    //                     required: ["src_ip", "dest_ip"]
    //                 }
    //             },
    //             {
    //                 name: "addWatchList",
    //                 description: "Add an IP address that is suspected to be malicious to the watchlist.",
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         ip: {
    //                             type: "string",
    //                             description: "The IP address to add to the watchlist."
    //                         },
    //                         reason: {
    //                             type: "string",
    //                             description: "The reason why the IP address is suspected to be malicious."
    //                         },
    //                         severityScale: {
    //                             type: "number",
    //                             description: "The severity of the IP address being suspected to be malicious."
    //                         }
    //                     },
    //                     required: ["ip", "reason", "severityScale"]
    //                 }
    //             },
    //             {
    //                 name: "addBlockedList",
    //                 description: "Add an IP address that is confirmed to be malicious to the blocked list.",
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         ip: {
    //                             type: "string",
    //                             description: "The IP address to add to the blocked list."
    //                         },
    //                         reason: {
    //                             type: "string",
    //                             description: "The reason why the IP address is confirmed to be malicious."
    //                         },
    //                         severityScale: {
    //                             type: "number",
    //                             description: "The severity of the IP address being confirmed to be malicious."
    //                         }
    //                     },
    //                     required: ["ip", "reason", "severityScale"]
    //                 }
    //             },
    //             {
    //                 name: "removeWatchList",
    //                 description: "Remove an IP address from the watchlist.",
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         ip: {
    //                             type: "string",
    //                             description: "The IP address to remove from the watchlist."
    //                         }
    //                     },
    //                     required: ["ip"]
    //                 }
    //             },
    //             {
    //                 name: "checkWatchListActive",
    //                 description: "Check if an IP address is in the watchlist.",
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         ip: {
    //                             type: "string",
    //                             description: "The IP address to check in the watchlist."
    //                         }
    //                     },
    //                     required: ["ip"]
    //                 }
    //             },
    //             {
    //                 name: "removeBlockedList",
    //                 description: "Remove an IP address from the blocked list.",
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         ip: {
    //                             type: "string",
    //                             description: "The IP address to remove from the blocked list."
    //                         }
    //                     },
    //                     required: ["ip"]
    //                 }
    //             },
    //             {
    //                 name: "checkBlockedListActive",
    //                 description: "Check if an IP address is in the blocked list.",
    //                 parameters: {
    //                     type: "object",
    //                     properties: {
    //                         ip: {
    //                             type: "string",
    //                             description: "The IP address to check in the blocked list."
    //                         }
    //                     },
    //                     required: ["ip"]
    //                 }
    //             }
    //         ]
    //     }
    // ],
    // toolConfig: { functionCallingConfig: { mode: "ANY" } },
})

const generationConfig = {
    temperature: 1.0,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
}

const run = async (initialPrompt, eventId) => {
    console.log("Initial prompt:", initialPrompt)
    initialPrompt = JSON.stringify(initialPrompt)
    const mq = new MongoQ()
    const chatSession = model.startChat({
        generationConfig,
        history: []
    })
    const result = await chatSession.sendMessage(initialPrompt)
    const response = JSON.parse(result.response.text());
    fs.writeFileSync("response.json", JSON.stringify(response, null, 2))

    if(!response.candidates){
        console.log("No candidates found")
    } else {
        let allFunctions = []
        for (const candidate of result.response.candidates) {
            for (const part of candidate.content.parts) {
                if (part.functionCall) {
                    const items = part.functionCall.args
                    const args = Object
                        .keys(items)
                        .map((data) => [data, items[data]])
                        .map(([key, value]) => `${key, value}`)
                    console.log(`${part.functionCall.name}(${args})`)
                    const funcresult = await handleFunctionCall(part.functionCall)
                    console.log("Function result:", funcresult)

                    const func = {
                        function_response: {
                            name: part.functionCall.name,
                            response: {
                                json: funcresult
                            }
                        }
                    }
                    allFunctions.push(func)
                    console.log("All functions:", allFunctions)
                }
            }
        }
        const updatedResponse = await chatSession.sendMessage({parts: allFunctions})
        console.log("Updated response:", updatedResponse)
        const response2 = updatedResponse.response
        const text = response2.text()
        const llm_reasoning = await mq.addLlmReason({text}, eventId)
        console.log("Llm reasoning:", llm_reasoning)
    }
    return response
}

const handleFunctionCall = async (functionCall) => {
    const functionName = functionCall.name
    const args = functionCall.args
    console.log("Function name:", functionName)

    switch (functionName) {
        case "getRecentIncidents":
            const n = args.n
            const recentIncidents = await mq.getRecentIncidents(n)
            return recentIncidents
        case "investigateConnectionHistory":
            const src_ip = args.src_ip
            const dest_ip = args.dest_ip
            const incidentsCount = args.n
            const connectionHistory = await mq.investigateConnectionHistory(src_ip, dest_ip, incidentsCount)
            return connectionHistory
        case "addWatchList":
            const watchListData = args
            const watchList = await mq.addWatchList(watchListData)
            return watchList
        case "addBlockedList":
            const blockedListData = args
            const blockedList = await mq.addBlockedList(blockedListData)
            return blockedList
        case "removeWatchList":
            const ip1 = args.ip
            const removedWatchList = await mq.removeWatchList(ip1)
            return removedWatchList
        case "checkWatchListActive":
            const ip2 = args.ip
            const watchListActive = await mq.checkWatchListActive(ip2)
            return watchListActive
        case "removeBlockedList":
            const ip3 = args.ip
            const removedBlockedList = await mq.removeBlockedList(ip3)
            return removedBlockedList
        case "checkBlockedListActive":
            const ip4 = args.ip
            const blockedListActive = await mq.checkBlockedListActive(ip4)
            return blockedListActive
        default:
            return "Function not found"
    }
}

export {run}