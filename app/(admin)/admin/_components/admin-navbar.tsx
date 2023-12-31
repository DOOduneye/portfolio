import Link from "next/link";
import { SettingsButton } from "./settings-button";

export const AdminNavbar = () => {

    return (
        <div className='flex flex-row w-full gap-2 px-8 border-b pb-4 border-gray-100 dark:border-gray-900'>
            <Link href='/' className="self-center">
                <h2 className='text-lg font-bold self-center'>David Oduneye</h2>
            </Link>
            <SettingsButton />
        </div>
    )
}