import Image from "next/image";

const Markdown = {
    h1: ({ children, ...props }) => <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-100" {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100" {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100" {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100" {...props}>{children}</h4>,
    h5: ({ children, ...props }) => <h5 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100" {...props}>{children}</h5>,
    h6: ({ children, ...props }) => <h6 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100" {...props}>{children}</h6>,
    p: ({ children, ...props }) => <p className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</p>,
    a: ({ children, ...props }) => <a className="text-blue-400 hover:underline underline-offset-4 " {...props}>{children}</a>,
    ul: ({ children, ...props }) => <ul className="mb-3 text-base font-normal list-disc list-inside text-slate-900 dark:text-slate-100" {...props}>{children}</ul>,
    ol: ({ children, ...props }) => <ol className="mb-3 text-base font-normal list-decimal list-inside text-slate-900 dark:text-slate-100" {...props}>{children}</ol>,
    li: ({ children, ...props }) => <li className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</li>,
    blockquote: ({ children, ...props }) => <blockquote className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</blockquote>,
    hr: ({ children, ...props }) => <hr className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</hr>,
    img: ({ children, ...props }) => <Image className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props} alt="" width={800} height={500}>{children}</Image>,
    pre: ({ children, ...props }) => <pre className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</pre>,
    code: ({ children, ...props }) => <code className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</code>,
    table: ({ children, ...props }) => <table className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</table>,
    thead: ({ children, ...props }) => <thead className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => <tbody className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</tbody>,
    tr: ({ children, ...props }) => <tr className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</tr>,
    th: ({ children, ...props }) => <th className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</th>,
    td: ({ children, ...props }) => <td className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</td>,
    em: ({ children, ...props }) => <em className="mb-3 text-base font-normal text-slate-200" {...props}>{children}</em>,
    strong: ({ children, ...props }) => <strong className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</strong>,
    del: ({ children, ...props }) => <del className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</del>,
    inlineCode: ({ children, ...props }) => <code className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</code>,
    br: ({ children, ...props }) => <br className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</br>,
    thematicBreak: ({ children, ...props }) => <hr className="mb-3 text-base font-normal text-slate-900 dark:text-slate-100" {...props}>{children}</hr>,
    math: ({children, ...props}) => <span className="inline-block p-1 font-mono text-sm text-gray-900 bg-gray-200 rounded" {...props}>{children}</span>,
    inlineMath: ({children, ...props}) => <span className="inline-block p-1 font-mono text-sm text-gray-900 bg-gray-200 rounded" {...props}>{children}</span>,
    wrapper: ({ children, ...props }) => <div className="prose-sm prose sm:prose lg:prose-lg xl:prose-xl" {...props}>{children}</div>,
    details: ({ children, ...props }) => <details className="my-4" {...props}>{children}</details>,
    summary: ({ children, ...props }) => <summary className="text-lg font-bold text-gray-900" {...props}>{children}</summary>,
    kbd: ({ children, ...props }) => <kbd className="px-2 py-1 font-mono text-sm text-gray-900 bg-gray-200 rounded" {...props}>{children}</kbd>,
    abbr: ({ children, ...props }) => <abbr className="underline" {...props}>{children}</abbr>,
    cite: ({ children, ...props }) => <cite className="italic" {...props}>{children}</cite>,
    q: ({ children, ...props }) => <q className="italic" {...props}>{children}</q>,
    sup: ({ children, ...props }) => <sup className="text-xs" {...props}>{children}</sup>,
    sub: ({ children, ...props }) => <sub className="text-xs" {...props}>{children}</sub>,
    dfn: ({ children, ...props }) => <dfn className="italic" {...props}>{children}</dfn>,
    time: ({ children, ...props }) => <time className="italic" {...props}>{children}</time>,
    b: ({ children, ...props }) => <b className="font-bold" {...props}>{children}</b>,
    i: ({ children, ...props }) => <i className="italic" {...props}>{children}</i>,
    u: ({ children, ...props }) => <u className="underline underline-offset-8" {...props}>{children}</u>,
    s: ({ children, ...props }) => <s className="line-through" {...props}>{children}</s>,
    small: ({ children, ...props }) => <small className="text-xs" {...props}>{children}</small>,
    mark: ({ children, ...props }) => <mark className="bg-yellow-300" {...props}>{children}</mark>,
    video: ({ children, ...props }) => <video className="w-full" {...props}>{children}</video>,
    audio: ({ children, ...props }) => <audio className="w-full" {...props}>{children}</audio>,
    iframe: ({ children, ...props }) => <iframe className="w-full" {...props}>{children}</iframe>,
}

export default Markdown;
