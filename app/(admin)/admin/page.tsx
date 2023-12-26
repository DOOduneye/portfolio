"use client"

import { userAtom } from "@/atoms/user-atom";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { Building, CopyCheck, Library, Newspaper, Plus } from "lucide-react";
import { AdminNavbar } from "../_components/AdminNavbar";

const Admin = () => {
    if (userAtom === null) {
        return <div>Loading...</div>
    }

    const user = useAtomValue(userAtom)

    const logout = async () => {
        await auth.signOut();
    }

    return (
        <>
            <AdminNavbar />
            <div className="flex flex-row gap-10 px-10">
                <div className="flex flex-col py-10 flex-2 gap-y-4">
                    <div onClick={() => { }} className="flex flex-row items-center cursor-pointer hover:bg-blue-200/20 bg-blue-200/20 dark:hover:bg-blue-100/20 pr-12 rounded-md py-2 pl-2 gap-x-2">
                        <Newspaper className="w-4 h-4" /> Posts
                    </div>
                    <div onClick={() => { }} className="flex flex-row items-center cursor-pointer hover:bg-blue-200/20 dark:hover:bg-blue-100/20 pr-12 rounded-md py-2 pl-2 gap-x-2">
                        <Building className="w-4 h-4" /> Experiences
                    </div>
                    <div onClick={() => { }} className="flex flex-row items-center cursor-pointer hover:bg-blue-200/20 dark:hover:bg-blue-100/20 pr-12 rounded-md py-2 pl-2 gap-x-2">
                        <CopyCheck className="w-4 h-4" /> Projects
                    </div>

                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-2xl font-semibold">Posts</h1>
                        <div className="flex flex-row items-center gap-2">
                            <Button className="px-4 py-2 text-sm font-semibold gap-2">
                                Add Post
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin;