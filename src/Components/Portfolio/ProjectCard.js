import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLink } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function ProjectCard(props) {
    return (
        <Link to={props.link}>
        <div className="py-10 px-5 rounded-md shadow-lg bg-[#191919] drop-shadow-2xl shadow-gray-900/5 border border-gray-900/50 hover:border-zinc-200/50 hover:inner-shadow hover:transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-200 duration-300">
        <div className="mx-auto max-w-prose text-lg hover:inner-shadow hover:rounded-lg">
            <h1>
                <span className="block text-lg font-semibold text-red-300">{props.date}</span>
                <span className="mt-2 block text-3xl font-bold leading-8 tracking-tight text-slate-200 sm:text-4xl">
                {props.title}
                </span>
            </h1>
            
            <p className="mt-5 text-lg leading-8 text-slate-200 text-justify">
                {props.description}
            </p>
    
            <div className="mt-5">
                <div className="inline-flex rounded-md shadow">
                    <Link to={props.link} className="bg-gradient-to-r from-pink-500 to-red-300 hover:bg-gradient-to-r transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-full text-slate-100 hover:text-white drop-shadow-lg shadow-lg hover:shadow-pink-800/40">
                        <FontAwesomeIcon icon={faLink} className="mr-2" />
                        View Project
                    </Link>

                </div>
            </div>
            </div>        
        </div>
        </Link>
    );
  }
