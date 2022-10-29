import links from '../../content/links';
import SocialItem from "./SocialItem";

import tw from 'tailwind-styled-components';

const SocialContainer = tw.ul`
    flex 
    flex-row 
    gap-10 
    animate-pulse
`;

export default function Social() {
    return (
        <SocialContainer>
            {links.map((link) => (  
                <SocialItem key={link.name} name={link.name} url={link.url} icon={link.icon} /> 
            ))}
        </SocialContainer>
    );
}
