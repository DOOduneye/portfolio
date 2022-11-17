import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/*<!-- Primary Meta Tags -->*/}
                <meta name="title" content="David Oduneye" />
                <meta
                    name="description"
                    content="David Oduneye's portfolio website and blog. Second-year Computer Science major at Northeastern University, who writes about technology, and things."
                />

                {/*<!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://metatags.io/" />
                <meta property="og:title" content="David Oduneye" />
                <meta
                    property="og:description"
                    content="David Oduneye's portfolio website and blog. Second-year Computer Science major at Northeastern University, who writes about technology, and things."
                />
                <meta
                    property="og:image"
                    content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"/>

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://metatags.io/" />
                <meta property="twitter:title" content="David Oduneye" />
                <meta
                    property="twitter:description"
                    content="David Oduneye's portfolio website and blog. Second-year Computer Science major at Northeastern University, who writes about technology, and things."
                />
                <meta
                    property="twitter:image"
                    content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
                />
            </Head>
            <body className="pattern-dots-sm w-screen h-screen  overflow-x-hidden">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
