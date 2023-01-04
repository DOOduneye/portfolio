import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const ButtonLink = ({ route }) => {
    return (
        <section className="flex flex-row justify-center p-5">
            <Link href={route} >
                <span className="flex flex-row items-center justify-center px-5 py-2 text-base font-medium text-white rounded-lg shadow-md bg-gradient-to-br from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600">
                    <span className="mr-2">View All</span>
                    <ArrowRightIcon className="w-5 h-5" />
                </span>
            </Link>
        </section>
    );
};

export default ButtonLink;