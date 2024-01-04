"use client";

import {
    useState,
    useRef,
    useCallback,
    useEffect
} from "react";

import { toast } from "sonner";

import { getResume } from "@/services/resume";

interface ResumeButtonProps {
    onClick?: (onClick: () => void) => void;
    children?: React.ReactNode;
}

export const ResumeButton = ({ onClick, children }: ResumeButtonProps) => {
    const [resumeFetched, setResumeFetched] = useState(false);
    const [resumeURL, setResumeURL] = useState('');
    const [isFetchingResume, setIsFetchingResume] = useState(false);

    const resumeLinkRef = useRef<HTMLAnchorElement>(null);

    const fetchResume = useCallback(async () => {
        if (resumeFetched || isFetchingResume) return;

        setIsFetchingResume(true);

        try {
            console.log('Fetching resume...');
            const fetchedResumeURL = await getResume();
            setResumeURL(fetchedResumeURL);
            setResumeFetched(true);
        } catch (error) {
            console.error('Error fetching resume:', error);
            toast.error('Error fetching resume', { duration: 3000 });
        } finally {
            setIsFetchingResume(false);
        }
    }, [resumeFetched, isFetchingResume]);

    const handleResumeClick = () => {
        if (!resumeFetched && !isFetchingResume) {
            fetchResume();
        } else if (resumeLinkRef.current) {
            resumeLinkRef.current.click();
        }
    };

    useEffect(() => {
        if (resumeFetched && resumeLinkRef.current) {
            resumeLinkRef.current.click();
        }
    }, [resumeFetched]);

    useEffect(() => {
        if (onClick) {
            onClick(handleResumeClick);
        }
    }, [onClick, handleResumeClick]);

    return (
        <div onClick={handleResumeClick} className="cursor-pointer">
            <a
                ref={resumeLinkRef}
                href={resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden"
            />
            {children}
        </div>
    )
}