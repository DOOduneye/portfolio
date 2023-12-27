import { Newspaper, Building, Library } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
    return (
        <div className="flex flex-col px-8 pt-10 h-screen">
            <div className="flex flex-col gap-y-2 pr-4">
                <Link href={"/admin/posts"} className="w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground">
                    <div className="flex flex-row gap-2">
                        <Newspaper className="w-5 h-5" />
                        <span>
                            Posts
                        </span>
                    </div>
                </Link>
                <Link href={"/admin/projects"} className="w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground">
                    <div className="flex flex-row gap-2">
                        <Building className="w-5 h-5" />
                        <span>
                            Projects
                        </span>
                    </div>
                </Link>
                <Link href={"/admin/experiences"} className="w-48 text-sm leading-6 flex items-center rounded-md px-3 py-2 font-semibold hover:bg-accent hover:text-accent-foreground">
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