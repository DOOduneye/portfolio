const StackCard = (props) => {
    return (
        <span className="px-3 py-2 text-base font-medium text-left duration-300 ease-in-out delay-150 border rounded-lg border-zinc-100/10 md:w-max hover:border-zinc-200/50 hover:inner-shadow hover:transition hover:-translate-y-2 hover:scale-200">
            {props.stack}
        </span>
    )
}

export default StackCard;