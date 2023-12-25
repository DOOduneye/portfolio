import { Badge } from "@/components/ui/badge";

const Project = () => {
    return (
        <main className="flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Project</h2>
            {Array.from({ length: 10 }, (_, i) => (
                <ProjectCard
                    title='The First Project'
                    description='This is the first project on my blog.'
                    tags={['tag1', 'tag2']}
                    year='2021'
                />
            ))}
        </main >
    );
}

export default Project;

export const ProjectCard = ({ title, description, tags, year }: { title: string, description: string, tags: string[], year: string }) => {
    return (
        <div className='p-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500'>
            <div className='flex flex-row justify-between gap-x-4'>
                <h3 className='text-xl font-bold'>
                    {title}
                </h3>
                <p className='text-sm text-gray-500'>{year}</p>
            </div>
            <div className='flex flex-row justify-between gap-x-4'>
                <p className='text-sm text-gray-500'>{description}</p>
                <div className='flex flex-row gap-x-2'>
                    {tags.map((tag, index) => (
                        <Badge key={index} variant={'outline'}>{tag}</Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
