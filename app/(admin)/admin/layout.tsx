
import { Footer } from "@/components/footer";
import { AdminNavbar } from "./_components/admin-navbar";
import { Sidebar } from "./_components/side-bar";

export default function ContentManagmentLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminNavbar />
            <div className="flex flex-row gap-10 px-8 sm:px-0 w-full sm:pr-8">
                <Sidebar />
                {children}
            </div>
            <Footer />
        </>
    )
}
