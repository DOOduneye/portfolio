import links from '../content/links';

const SocialItem = (props) => {
    return (
        <button className="transition duration-300 ease-out opacity-80 dark:text-slate-400 text-slate-800/80 hover:-translate-x-1 hover:scale-110">
            <a href={props.url} target="_blank" rel="noreferrer">
                {props.icon}
            </a>
        </button>
    );
}

const Socials = () => {
    return (
        <div className="flex flex-row gap-10 mt-10">
            {links.map((link) => (
                <SocialItem key={link.name} name={link.name} url={link.url} icon={link.icon} />
            ))}
        </div>
    );
}

export default Socials;

