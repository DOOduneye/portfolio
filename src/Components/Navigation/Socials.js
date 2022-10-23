import links from "./links";
import SocialsItem from "./SocialsItem";


function Socials() {
    return (
        <ul className="flex flex-row gap-10 animate-pulse">
            {links.map((link) => (  
                <SocialsItem key={link.name} name={link.name} url={link.url} icon={link.icon} /> 
            ))}
        </ul>
    );
}


export default Socials;