"use client"

import Link from "next/link";

import { Settings } from "lucide-react";

import { auth } from "@/lib/firebase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle"

export const AdminNavbar = () => {

    const logout = async () => {
        await auth.signOut();
    }

    return (
        <div className='flex flex-row w-full gap-2 px-8 border-b pb-4 border-gray-100 dark:border-gray-900'>
            <Link href='/' className="self-center">
                <h2 className='text-lg font-bold self-center'>David Oduneye</h2>
            </Link>
            <div className='flex flex-row flex-1 justify-end gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className='flex flex-row justify-between gap-x-2 items-center border-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'>
                            <div className='flex flex-col gap-y-1'>
                                <Settings className='w-4 h-4' />
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <DropdownMenuLabel onClick={logout}>Logout</DropdownMenuLabel>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
            </div>
        </div>
    )
}
