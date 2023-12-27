"use client"

import { userAtom } from "@/atoms/user-atom";
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { useAtomValue } from "jotai";
import { Settings } from "lucide-react";
import Link from "next/link";

export const AdminNavbar = () => {
    const user = useAtomValue(userAtom);

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
                {/* <Button className='px-4 py-2 text-sm font-semibold' onClick={logout}>Logout</Button> */}
                <ModeToggle />
            </div>
        </div>
    )
}

// export const SettingsModal = () => {

//     return (
//         <Dialog open={true} onClose={() => { }} onOpenChange={() => { }}>
//             <DialogContent>
//                 <DialogHeader className="border-b pb-3">
//                     <h2 className="text-lg font-medium">My Settings</h2>
//                 </DialogHeader>
//                 <div className="flex item-center justify-between">
//                     <div className="flex flex-col gap-y-1">
//                         <Label>
//                             Appearance
//                         </Label>
//                         <span className="text-[0.8rem] text-muted-foreground">
//                             Customize how Jotion looks on your device
//                         </span>
//                     </div>
//                     <ModeToggle />
//                 </div>
//             </DialogContent>
//         </Dialog >
//     )
// }