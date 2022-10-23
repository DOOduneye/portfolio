import '../../App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function HomeMainSection() {
    return (
        <section className="flex flex-row p-12">
            <div className="flex flex-col">
                <div className="flex flex-row gap-20">
                    <div>
                        <h1 className="font-sans font-bold text-8xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-300"> 
                            David Oduneye 
                        </h1>
                        <p className="font-sans font-bold text-slate-100 text-3xl">
                            Passionate about building <br />Software that is both <span className="text-red-300">beautiful</span> and <span className="text-red-300">functional</span>
                        </p>
                    </div>

                    <a href="https://www.smithsonianmag.com/air-space-magazine/call-new-world-180977307/" target="_blank" rel="noreferrer">
                     <FontAwesomeIcon icon={faPaperPlane} className="mx-10 text-red-300 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 text-[200px]" />
                    </a>
                </div>
            </div>
        </section>
    );
}

export default HomeMainSection;