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

export type GetCoordinateToolResponse = {
    name: string
    place: string
    lat: number
    lng: number
}

export default function ExploreApp() {
    const [coordinates, setCoordinates] = useState<GetCoordinateToolResponse[] | undefined>(undefined)
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hola! Bienvenido a Atlas AI 🌎", sender: "bot" },
    ])

    const chatContainerRef = useRef<HTMLDivElement>(null)

    const handleSend = async (question: string) => {
        if (!question.trim()) return

        const nextId = messages.length + 1
        setMessages(prev => [...prev, { id: nextId, text: question, sender: "user" }])

        try {
            const responseAgent = await fetch("/api/ai", {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ question })
            })

            const response = await responseAgent.json()

            if (response.places?.length) {
                const dataTool = response.places.filter(
                    (e: any) => e.name === "get_coordinates"
                ) as GetCoordinateToolResponse[]
                setCoordinates(dataTool)
            }

            setMessages(prev => [
                ...prev,
                { id: nextId + 1, text: response.text, sender: "bot" }
            ])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const chat = chatContainerRef.current
        if (!chat) return
        chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" })
    }, [messages])

    return (
        <div className="flex flex-col md:flex-row h-dvh">

            {/* MAPA — arriba en mobile, derecha en desktop */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full bg-gray-100">
                <MapView coordinates={coordinates} />
            </div>

            {/* CHAT */}
            <div className="w-full md:w-1/2 h-[60vh] md:h-full flex flex-col border-t md:border-t-0 md:border-l border-gray-300">

                {/* MENSAJES */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
                >
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`p-2 rounded-md max-w-[80%] ${
                                msg.sender === "user"
                                    ? "bg-blue-500 text-white ml-auto"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))}
                </div>

                {/* INPUT */}
                <div className="p-4 border-t bg-white">
                    <PromptInput onSend={handleSend} />
                </div>
            </div>
        </div>
    )
}
