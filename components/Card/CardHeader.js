import { HeadingSection, HeadingText } from '@/styles/styles';

const CardHeader = ({ title }) => {
    return (
        <HeadingSection>
            <HeadingText>{title}</HeadingText>
        </HeadingSection>
    );
}

export default CardHeader;