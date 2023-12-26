import { userAtom } from "@/atoms/user-atom";
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase";
import { useAtomValue } from "jotai";

export const AdminNavbar = () => {
    const user = useAtomValue(userAtom);

    const logout = async () => {
        await auth.signOut();
    }

    return (
        <div className='flex flex-row w-full gap-2 px-8 border-b pb-2 border-gray-100 dark:border-gray-900'>
            <h2 className='text-md font-bold self-center'>David Oduneye</h2>
            <div className='flex flex-row flex-1 justify-end gap-2'>
                <Button className='px-4 py-2 text-sm font-semibold' onClick={logout}>Logout</Button>
                <ModeToggle />
            </div>
        </div>
    )
}