import { MDXRemote } from 'next-mdx-remote';

export default function TextCard(props) {
    return (
        <div>
            <div className="overflow-hidden h-full p-10 mt-10 rounded-md shadow-lg bg-[#191919] drop-shadow-2xl shadow-gray-900/5 border border-zinc-100/10 hover:border-zinc-200/50 hover:transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-200 duration-300">
                <div className="mx-auto text-lg max-w-prose">
                    <h1>
                        <span className="block text-lg font-semibold text-center text-red-300">{props.date}</span>
                        <span className="block mt-2 text-3xl font-bold leading-8 tracking-tight text-center text-white sm:text-4xl">
                            {props.title}
                        </span>
                    </h1>

                    <div className="mt-8 text-lg leading-8 text-left text-slate-900">
                        {/* TODO: Parse string into HTML */}
                        <MDXRemote {...props.MDXRemote} />

                        <br />
                        <br />

                        <div className="w-full h-5 rounded-lg bg-gradient-to-r from-pink-500 to-red-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
