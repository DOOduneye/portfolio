"use client";

import { Settings } from "lucide-react";

import { auth } from "@/lib/firebase";
import { useSettings } from "@/hooks/use-settings";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const SettingsButton = () => {
    const settings = useSettings();

    const logout = async () => {
        await auth.signOut();
    }

    return (
        <div className='flex flex-row flex-1 justify-end gap-2'>
            <DropdownMenu>
                <DropdownMenuTrigger className="border-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className='w-4 h-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem>
                        <DropdownMenuLabel onClick={settings.onOpen}>Settings</DropdownMenuLabel>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <DropdownMenuLabel onClick={logout}>Logout</DropdownMenuLabel>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}