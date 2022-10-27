export default function SocialsItem(props) {
    return (
        <a href={props.url} target="_blank" rel="noreferrer" className="opacity-80 text-slate-400 transition ease-out hover:-translate-x-1 hover:scale-110 duration-300"> 
            {props.icon}
        </a>
    );
}
