'use client'

import Header from "@/app/components/common/Header"
import PromptInput from "@/app/components/prompt/PromptInput"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

const MapView = dynamic(
    () => import('@/app/components/map/MapView'),
    { ssr: false }
)

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
    const [coordinates, setCoordinates] = useState<GetCoordinateToolResponse[]>()
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hola! Bienvenido a Atlas AI 🌎", sender: "bot" },
    ])

    const chatContainerRef = useRef<HTMLDivElement>(null)

    const handleSend = async (question: string) => {
        if (!question.trim()) return

        const nextId = messages.length + 1
        setMessages(prev => [
            ...prev,
            { id: nextId, text: question, sender: "user" }
        ])

        try {
            const responseAgent = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        <div className="flex flex-col h-dvh overflow-hidden">
            <Header />

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="w-full md:w-1/2 h-[40%] md:h-full bg-gray-100">
                    <MapView coordinates={coordinates} />
                </div>

                <div className="w-full md:w-1/2 h-[60%] md:h-full flex flex-col border-t md:border-t-0 md:border-l border-gray-300">
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
                    >
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`
                                            inline-block
                                            p-2
                                            rounded-2xl
                                            max-w-[80%]
                                            break-words
                                            animate-fade-in-up
                                            px-4 
                                            py-2.5
                                            ${msg.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                        }
                                        `}
                                >
                                    <ReactMarkdown>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="p-4 border-t bg-white">
                        <PromptInput onSend={handleSend} />
                    </div>
                </div>
            </div>
        </div>
    )
}
