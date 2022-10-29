import tw from 'tailwind-styled-components';

const FontAwesomeIconContainer = tw.button`
    opacity-80
    text-slate-400 
    transition 
    ease-out 
    hover:-translate-x-1 
    hover:scale-110 
    duration-300
`;

export default function SocialsItem(props) {
    return (
        <FontAwesomeIconContainer>
            <a href={props.url} target="_blank" rel="noreferrer"> 
                {props.icon}
            </a>
        </FontAwesomeIconContainer>
    );
}
