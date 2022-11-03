import links from '../../content/links';
import SocialItem from './SocialItem';

import { SocialContainer } from '@/styles/styles';

const Social = () => {
    return (
        <SocialContainer>
            {links.map((link) => (
                <SocialItem key={link.name} name={link.name} url={link.url} icon={link.icon} />
            ))}
        </SocialContainer>
    );
}

export default Social;