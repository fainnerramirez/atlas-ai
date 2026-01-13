import { Avatar } from "@heroui/react";
import Link from "next/link";
import { GrMapLocation } from "react-icons/gr";

export default function Header() {
    return (
        <div className="flex justify-between items-center p-3 w-[98%] m-auto">
            <div>
                <Link href="/" className="flex gap-3 items-center">
                    <GrMapLocation size={25} />
                    <h3 className="font-bold text-xl">Atlas AI</h3>
                </Link>
            </div>
            <div className="hidden md:block">
                <div className="flex justify-center items-center gap-4">
                    <h3>Asistente</h3> |
                    <h3>Chat</h3>
                </div>
            </div>
            <div>
                <Avatar
                    isBordered
                    size="sm"
                    color="default"
                    src="https://api.dicebear.com/9.x/icons/svg?seed=Leo"
                />
            </div>
        </div>
    )
}