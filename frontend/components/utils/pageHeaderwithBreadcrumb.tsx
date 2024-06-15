import { Breadcrumb } from 'antd';
import React, { FC } from 'react';

interface Crumb {
    title: string;
    href?: string;
}

interface Props {
    crumbs: Crumb[];
    title: string;
    description: string;
}

const PageHeaderWithBreadcrumb: FC<Props> = ({ crumbs, title, description }) => {
    return (
        <header className="dark:bg-gray-800 p-2 rounded-md">
            <Breadcrumb className="dark:text-white">
                {crumbs.map((crumb, index) => (
                    <Breadcrumb.Item key={index} href={crumb.href} className="dark:text-gray-300">
                        {crumb.title}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <div className="py-4">
                <h1 className="text-lg sm:text-2xl text-gray-900 dark:text-white">{title}</h1>
                <p className="text-sm tracking-wider text-gray-500 dark:text-gray-300">{description}</p>
            </div>
        </header>
    );
};

export default PageHeaderWithBreadcrumb;
