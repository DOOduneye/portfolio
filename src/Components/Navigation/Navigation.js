import NavItem from './NavItem';
import Socials from './Socials.js';
import ThemeToggle from './ThemeToggle.js';

function Navigation() {
    return (
        <nav className="flex flex-row justify-center">
            <section className="flex flex-row gap-20 pt-5"> 
                    <NavItem title={"Home"} link={"/"} />
                    <NavItem title={"Blog"} link={"/blog"} />
                    <NavItem title={"Portfolio"} link={"/portfolio"} />
                    <NavItem title={"About"} link={"/about"} />
                    {/* <NavItem title={"Uses"} link={"/uses"} /> */}
                    <Socials />

                <section className="flex flex-row gap-10">
                    <ThemeToggle /> 
                </section> 
            </section>
        </nav>

    );
}

export default Navigation;