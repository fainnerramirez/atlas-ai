'use client'

import PromptInput from "@/app/components/prompt/PromptInput"
import { useState } from "react"

type Message = {
    id: number
    text: string
    sender: "user" | "bot"
}

export default function ExploreApp() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hola! Bienvenido a Atlas AI 🌎", sender: "bot" },
    ])

    const handleSend = (text: string) => {
        if (!text.trim()) return

        const userMessage: Message = {
            id: messages.length + 1,
            text,
            sender: "user",
        }

        setMessages([...messages, userMessage])

        // Simula respuesta del bot (puedes reemplazar con API)
        setTimeout(() => {
            const botMessage: Message = {
                id: messages.length + 2,
                text: "Estoy procesando tu consulta... 🌐",
                sender: "bot",
            }
            setMessages(prev => [...prev, botMessage])
        }, 1000)
    }

    return (
        <div className="flex min-h-screen">
            {/* Chat */}
            <div className="w-1/2 border-r border-gray-300 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`p-2 rounded-md max-w-xs ${msg.sender === "user"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-300">
                    <PromptInput onSend={handleSend} />
                </div>
            </div>

            {/* Mapa */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                {/* Aquí va tu mapa (puede ser Google Maps, Leaflet, Mapbox, etc.) */}
                <div className="text-gray-500">[Mapa aquí]</div>
            </div>
        </div>
    )
}
