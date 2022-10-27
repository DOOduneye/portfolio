import links from '../../content/links';
import SocialItem from "./SocialItem";

export default function Social() {
    return (
        <ul className="flex flex-row gap-10 animate-pulse">
            {links.map((link) => (  
                <SocialItem key={link.name} name={link.name} url={link.url} icon={link.icon} /> 
            ))}
        </ul>
    );
}
