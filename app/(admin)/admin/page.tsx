"use client"

import { userAtom } from "@/atoms/user-atom";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { AdminNavbar } from "./_components/admin-navbar";
import Sidebar from "./_components/side-bar";
import { useEffect } from "react";
import { redirect } from "next/navigation";

const Admin = () => {

    useEffect(() => {
        redirect('/admin/posts')
    }, [])

    return (
        <></>
    );
}

export default Admin;