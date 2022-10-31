import { MDXRemote } from 'next-mdx-remote';

export default function TextCard(props) {
    return (
        <div>
            <div className="overflow-hidden h-full p-10 mt-10 rounded-md shadow-lg bg-[#191919] drop-shadow-2xl shadow-gray-900/5 border border-zinc-100/10 hover:border-zinc-200/50 hover:transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-200 duration-300">
                <div className="mx-auto max-w-prose text-lg">
                    <h1>
                        <span className="block text-center text-lg font-semibold text-red-300">{props.date}</span>
                        <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
                            {props.title}
                        </span>
                    </h1>

                    <div className="mt-8 text-lg leading-8 text-slate-200 text-justify">
                        {/* TODO: Parse string into HTML */}
                        <MDXRemote {...props.MDXRemote} />

                        <br />
                        <br />

                        <div className="h-5 w-full bg-gradient-to-r from-pink-500 to-red-300 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
