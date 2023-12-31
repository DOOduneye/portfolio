"use client"

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