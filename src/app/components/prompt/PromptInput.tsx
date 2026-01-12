import { Textarea } from "@heroui/react";
import { useState } from "react";

export default function PromptInput({ onSend }: { onSend: (text: string) => void }) {
    const [value, setValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!value.trim()) return;
            onSend(value.trim());
            setValue("");
        }
    }

    return (
        <Textarea
            className="w-full"
            label="¿A dónde quieres viajar?"
            placeholder="Presiona Enter para enviar tu solicitud"
            variant="faded"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
        />
    );
}
