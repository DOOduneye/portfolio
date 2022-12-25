const CardHeader = ({ title }) => {
    return (
        <section className="flex flex-row justify-center p-10">
            <p className="mt-1 text-base text-gray-500">
                {title}
            </p>
        </section>
    );
}

export default CardHeader;