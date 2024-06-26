import { webDevelopmentToC } from '@/common/constants/DummyTOC';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

type TableOfContentsProps = {};

const TableOfContents: React.FC<TableOfContentsProps> = () => {
    return (
        <div className='hidden h-full flex-1 py-2 md:block'>
            <h3 className='text-sm text-foreground'>Table of Contents</h3>
            <ul className='mt-2 space-y-2'>
                {webDevelopmentToC.map((item, index) => (
                    <TableOfContentsItem key={index} {...item} />
                ))}
            </ul>
        </div>
    );
};
export default TableOfContents;

type TableOfContentsItemProps = {
    id: string;
    title: string;
    description: string;
    subSections?: {
        id: string;
        title: string;
        description: string;
    }[];
};
const TableOfContentsItem = (props: TableOfContentsItemProps) => {
    return (
        <li key={props.id} className='space-y-2'>
            <Link
                href='#'
                className='flex max-w-xs justify-between text-xs text-muted-foreground hover:text-foreground'
            >
                <span>{props.title}</span>{' '}
                {props.subSections && <ChevronDown size={12} />}
            </Link>

            {props.subSections && (
                <ul className='space-y-2 px-4'>
                    {props.subSections.map((item, index) => (
                        <TableOfContentsItem key={index} {...item} />
                    ))}
                </ul>
            )}
        </li>
    );
};
