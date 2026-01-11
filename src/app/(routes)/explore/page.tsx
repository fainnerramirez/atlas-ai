'use client'

import PromptInput from "@/app/components/prompt/PromptInput"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

const MapView = dynamic(() => import('@/app/components/map/MapView'), { ssr: false })

type Message = {
    id: number
    text: string
    sender: "user" | "bot"
}

export type GetCoordinateToolResponse = { name: string, place: string, lat: number, lng: number };

export default function ExploreApp() {
    const [coordinates, setCoordinates] = useState<GetCoordinateToolResponse[] | undefined>(undefined)
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hola! Bienvenido a Atlas AI 🌎", sender: "bot" },
    ])

    const chatContainerRef = useRef<HTMLDivElement>(null)

    const handleSend = async (question: string) => {
        if (!question.trim()) return

        const nextId = messages.length + 1
        const userMessage: Message = { id: nextId, text: question, sender: "user" }
        setMessages(prev => [...prev, userMessage])

        try {

            const responseAgent = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ question })
            })

            if (!responseAgent.ok) {
                throw new Error(`Ha ocurrido un error al generar la respuesta de IA: ${JSON.stringify(responseAgent)}`)
            }

            const response = await responseAgent.json();
            console.log("DATA AI: ", response);

            if (response.places && response.places.length > 0) {
                const dataTool = Array.from(response.places)
                    .filter((e: any) => e.name === "get_coordinates") as GetCoordinateToolResponse[]
                setCoordinates(dataTool);
            }

            const botMessage: Message = {
                id: nextId + 1,
                text: response.text,
                sender: "bot"
            }

            setMessages(prev => [...prev, botMessage])
        }
        catch (error) {
            console.error(`Ha ocurrido un error al generar la respuesta de IA ${error}`)
        }
    }

    useEffect(() => {
        const chat = chatContainerRef.current
        if (!chat) return
        chat.scrollTo({
            top: chat.scrollHeight,
            behavior: "smooth",
        })
    }, [messages])

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 border-r border-gray-300 flex flex-col h-screen">
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
                    style={{ minHeight: 0 }}
                >
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`p-2 rounded-md max-w-md ${msg.sender === "user"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            <ReactMarkdown>
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-300">
                    <PromptInput onSend={handleSend} />
                </div>
            </div>

            <div className="w-1/2 bg-gray-100 flex items-center justify-center h-screen">
                <MapView coordinates={coordinates} />
            </div>
        </div>
    )
}
