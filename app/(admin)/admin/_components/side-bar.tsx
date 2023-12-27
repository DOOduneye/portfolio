"use client";

import { cn } from "@/lib/utils";
import { Newspaper, Building, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="hidden sm:flex sm:flex-col sm:px-8 sm:pt-10 sm:h-screen">
            <div className="flex flex-col gap-y-2 pr-4">
                <Link href={"/admin/posts"} className={cn("w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground", pathname === '/admin/posts' && 'bg-accent text-accent-foreground')}>
                    <div className="flex flex-row gap-2">
                        <Newspaper className="w-5 h-5" />
                        <span>
                            Posts
                        </span>
                    </div>
                </Link>
                <Link href={"/admin/projects"} className={cn("w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground", pathname === '/admin/projects' && 'bg-accent text-accent-foreground')}>
                    <div className="flex flex-row gap-2">
                        <Building className="w-5 h-5" />
                        <span>
                            Projects
                        </span>
                    </div>
                </Link>
                <Link href={"/admin/experiences"} className={cn("w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground", pathname === '/admin/experiences' && 'bg-accent text-accent-foreground')}>
                    <div className="flex flex-row gap-2">
                        <Library className="w-5 h-5" />
                        <span>
                            Experiences
                        </span>
                    </div>
                </Link>
            </div>

        </div>
    );
}

export default Sidebar;