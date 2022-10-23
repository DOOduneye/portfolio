import { Link } from 'react-router-dom';

function NavItem(props) {
    
    return (
        <Link to={props.link} className="inline-block font-sans font-regular bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-300 text-xl transition ease-out hover:-translate-x-1 hover:scale-110 duration-300">
            {props.title}
        </Link>
    );
}

export default NavItem;