import '../../App.scss';

import Navigation from '../Navigation/Navigation';
import Footer from '../Footer';
import ProjectCard from './ProjectCard';
import projects from './projects.js';

function Projects() {
    return (        
        <main className="grid grid-flow-row auto-rows-max h-full w-full">
            <section>
                <Navigation />
            </section>

            <section className="flex flex-row justify-center p-12">
                <p className="mt-1 text-base text-gray-500">
                    Things I've built* (and things I'm working on).
                </p>
        </section>

        <section className="grid grid-flow-col mx-auto grid-rows-4 gap-4 px-1">
            {projects.map((projects) => (  
                    <ProjectCard key={projects.title} date={projects.date} title={projects.title} description={projects.description} link={projects.link} />
            ))}
        </section>

        <Footer />
        </main> 
    );
}

export default Projects;