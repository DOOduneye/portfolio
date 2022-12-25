import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import StackCard from '@/components/StackCard'

export default function ProjectCard(props) {

    const { project: { frontmatter: { title, date, description, link, button, stack } } } = props;

    const url = link == '#' ? '' : `https://www.` +link;

    const stackList = stack.split('—')

    return (
        <Link href={url} rel="noopener noreferrer" className="content-end h-full duration-300 ease-in-out delay-150 border border-gray-700 rounded-lg shadow-md bg-gray-800/20 drop-shadow-lg shadow-gray-900/100 border-zinc-100/10 hover:border-zinc-200/50 hover:inner-shadow hover:transition hover:-translate-y-2 hover:scale-200">
                <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{title}</h5>
                    <span className="items-end block mt-2 text-lg font-semibold text-gray-400">
                        {date}
                    </span>
                    <p className="mb-3 font-normal text-gray-400">
                        {description}
                    </p>
                    <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 bg-gradient-to-br from-purple-400 to-blue-500 animate-gradient-x">
                        <FontAwesomeIcon icon={faLink} className="mr-2" />
                        {button}
                    </span>
                    <span className="flex flex-row flex-wrap gap-2 mt-10 text-slate-200">
                        {stackList.map((stack) => <StackCard key={stack} stack={stack.trim()} /> )}
                    </span>
                </div>
        </Link>
    );
}