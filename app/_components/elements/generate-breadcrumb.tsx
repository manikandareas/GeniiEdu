import React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '../ui/breadcrumb';
import { nanoid } from 'nanoid';

export type BreadcrumbURLs = {
    name: string;
    href: string;
}[];

type GenerateBreadcrumbProps = {
    urls: BreadcrumbURLs;
};

const GenerateBreadcrumb: React.FC<GenerateBreadcrumbProps> = (props) => {
    return (
        <Breadcrumb className='mb-5'>
            <BreadcrumbList>
                {props.urls.map((item, idx) => (
                    <React.Fragment key={nanoid()}>
                        <BreadcrumbItem>
                            {props.urls.length - 1 !== idx ? (
                                <BreadcrumbLink href={item.href}>
                                    {item.name}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {props.urls.length - 1 !== idx && (
                            <BreadcrumbSeparator key={idx} />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
export default GenerateBreadcrumb;
