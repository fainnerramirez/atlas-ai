'use client'

import PromptInput from "@/app/components/prompt/PromptInput"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

const MapView = dynamic(() => import('@/app/components/map/MapView'), { ssr: false })

type Message = {
    id: number
    text: string
    sender: "user" | "bot"
}

export default function ExploreApp() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hola! Bienvenido a Atlas AI 🌎", sender: "bot" },
    ])

    const chatContainerRef = useRef<HTMLDivElement>(null)

    const handleSend = (text: string) => {
        if (!text.trim()) return

        const nextId = messages.length + 1
        const userMessage: Message = { id: nextId, text, sender: "user" }
        setMessages(prev => [...prev, userMessage])

        setTimeout(() => {
            const botMessage: Message = {
                id: nextId + 1,
                text: "Estoy procesando tu consulta... 🌐",
                sender: "bot",
            }
            setMessages(prev => [...prev, botMessage])
        }, 1000)
    }

    useEffect(() => {
        const chat = chatContainerRef.current
        if (!chat) return

        const isAtBottom = chat.scrollHeight - chat.scrollTop - chat.clientHeight < 50

        if (isAtBottom) {
            chat.scrollTo({
                top: chat.scrollHeight,
                behavior: "smooth",
            })
        }
    }, [messages])

    return (
        <div className="flex min-h-screen">
            {/* Chat */}
            <div className="w-1/2 border-r border-gray-300 flex flex-col h-screen">
                {/* Contenedor de mensajes con scroll */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
                    style={{ minHeight: 0 }} // evita que flex-1 crezca más de lo debido
                >
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

            <div className="w-1/2 bg-gray-100 flex items-center justify-center h-screen">
                <MapView />
            </div>
        </div>
    )
}
