import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const links = [
    {
        name: 'Spotify',
        url: 'https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy',
        icon: <FontAwesomeIcon icon={faSpotify} size="2x" />,
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/dooduneye',
        icon: <FontAwesomeIcon icon={faLinkedin} size="2x" />,
    },
    {
        name: 'Github',
        url: 'https://github.com/DOOduneye/',
        icon: <FontAwesomeIcon icon={faGithub} size="2x" />,
    },
];

export default links;

