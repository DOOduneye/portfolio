import Navigation from '@/components/Navigation/Navigation';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col">
            <Navigation />
            <main>{children}</main>
        </div>
    );
};

export default Layout;