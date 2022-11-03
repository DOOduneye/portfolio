import tw from 'tailwind-styled-components';

const Gradient = tw.p`
    bg-clip-text
    bg-gradient-to-r
    from-[#4ECDC4]
    to-[#B4A0E5]
`;

const Underline = tw.span`
    hover:underline
    hover:decoration-[#4ECDC4]
    hover:underline-offset-8 
    hover:decoration-3 
    hover:transition
    hover:duration-300 
    hover:ease-in-out 
    hover:delay-150 
    hover:translatex-1
`;

const Paragraph = tw(Gradient)`
    lg:text-3xl
    md:text-2xl
    text-xl
    text-transparent
    text-left
    font-sans
    font-bold
`;

const SubTitle = () => {
    return (
        <Paragraph>
            Passionate about building <br /> Software that is both 
                <Underline> functional </Underline> 
                and 
                <Underline> functional</Underline>.
        </Paragraph>

    )
}

export default SubTitle;