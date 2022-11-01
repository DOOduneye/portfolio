import Link from 'next/link';

export default function PostCard(props) {
    return (
        <Link href={`posts/${props.post.slug}`}>
            <div className="py-10 px-5 rounded-md shadow-lg bg-[#191919] drop-shadow-lg shadow-gray-900/5 border border-zinc-100/10 hover:border-zinc-200/50 hover:inner-shadow hover:transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-200 duration-300">
                <div className="mx-auto max-w-prose text-lg hover:inner-shadow hover:rounded-lg">
                    <h1>
                        <span className="block text-lg font-md text-[#F57A89]">{props.post.frontmatter.date}</span>
                        <span className="mt-2 block text-3xl font-bold leading-8 tracking-tight text-slate-200 sm:text-4xl">
                            {props.post.frontmatter.title}
                        </span>
                    </h1>

                    <p className="mt-5 text-lg leading-8 text-slate-200 text-left">
                        {props.post.frontmatter.description}
                    </p>

                    <div className="mt-5 ">
                        <div className="inline-flex rounded-md shadow">
                            <button className="bg-[#F57A89] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-full text-slate-100 hover:text-white drop-shadow-sm shadow-lg hover:shadow-sky-800/40">
                                Read Article
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
