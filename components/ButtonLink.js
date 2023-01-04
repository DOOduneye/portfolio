import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const ButtonLink = ({ route }) => {
    return (
        <section className="flex flex-row justify-center p-5">
            <Link href={route} >
                <span className="flex flex-row items-center justify-center px-5 py-2 text-base font-medium transition duration-300 ease-in-out rounded-lg text-slate-900 dark:text-slate-200 hover:translate-x-1">
                    <span className="mr-2">View More</span>
                    <ArrowRightIcon className="w-5 h-5" />
                </span>
            </Link>
        </section>
    );
};

export default ButtonLink;