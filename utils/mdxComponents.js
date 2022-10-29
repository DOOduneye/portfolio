export default {
    img: (props) => <img {...props} className="w-full" />,
    h1: (props) => <h1 {...props} className="text-4xl font-bold" />,
    h2: (props) => <h2 {...props} className="text-3xl font-bold" />,
    p: (props) => <p {...props} className="text-lg" />,
    pre: (props) => <pre {...props} className="bg-gray-800 p-4 rounded-md" />,
    code: (props) => <code {...props} className="bg-gray-800 p-2 rounded-md" />,
    a: (props) => <a {...props} className="text-blue-500" />,
    ul: (props) => <ul {...props} className="list-disc ml-8 bg-orange-100" />,
  }
  