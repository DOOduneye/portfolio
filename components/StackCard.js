const StackCard = (props) => {
    return (
        <span className="text-base font-medium rounded-lg px-3 py-2 text-left border border-zinc-100/10 md:w-max hover:border-zinc-200/50 hover:inner-shadow hover:transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-200 duration-300">
            {props.stack}
        </span>
    )
}

export default StackCard;