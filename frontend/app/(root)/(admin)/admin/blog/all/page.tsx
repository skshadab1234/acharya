'use client';

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Modal, Spin, Popover, message, Tag, Space } from 'antd';
import PageHeaderWithBreadcrumb from '@/components/utils/pageHeaderwithBreadcrumb';
import { debounce } from 'lodash';
import moment from 'moment';
import { EditIcon, TrashIcon } from 'lucide-react';
import { getCookie } from '@/components/layouts/header';
import { useRouter } from 'next/navigation';

const ActivitiesAll = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalActivities, setTotalBlogs] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visiblePopoverId, setVisiblePopoverId] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchBlogs(page, pageSize, searchTerm);
    }, [page, pageSize]);

    const fetchBlogs = async (page, pageSize, searchTerm) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ page: String(page), pageSize: String(pageSize), search: searchTerm }).toString();
            const response = await fetch(`${process.env.ADMINURL}/api/allblogs?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setBlogs(data.blogs);
            setTotalBlogs(data.totalBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
        setLoading(false);
    };

    const handleSearch = debounce((value: string) => {
        setSearchTerm(value);
        fetchBlogs(1, 10, value);
        setPage(1); // Reset to the first page on new search
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    const handleEdit = (activityId: number) => {
        // Redirect to edit page or open modal for editing activity
        console.log('Edit activity', activityId);
        router.push(`/admin/blog/manageblog?id=${activityId}`);
    };

    const handleDelete = async (activityId: number) => {
        try {
            const response = await fetch(`${process.env.ADMINURL}/api/deleteBlogs`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + getCookie('tokenSagartech'),
                },
                body: JSON.stringify({ id: activityId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete activity');
            }

            console.log('Delete activity', activityId);

            // Optionally, you might want to fetch the updated list of blogs from the server
            // after deletion to ensure you have the latest data.
            // For now, we assume we can filter out the deleted activity from the current state.
            message.success('Activity Deleted Successfully!');
            setBlogs((prevActivities) => prevActivities.filter((activity) => activity.id !== activityId));
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };
    const handleTableChange = (page: number, pageSize: number) => {
        setPage(page);
        setPageSize(pageSize);
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleSearch(value);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'short_description',
            key: 'short_description',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Keywords',
            dataIndex: 'keywords',
            key: 'keywords',
            render: (keywords) => {
                // Split the keywords string into an array
                const keywordsArray = keywords?.split(',').map((keyword) => keyword.trim());

                const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
                return (
                    <div>
                        {keywordsArray &&
                            keywordsArray.map((keyword, index) => (
                                <Space className='m-1'>
                                    <Tag color={colors[index % colors.length]} key={keyword}>
                                        {keyword}
                                    </Tag>
                                </Space>
                            ))}
                    </div>
                );
            },
        },

        {
            title: 'Creation Date',
            dataIndex: 'date',
            key: 'date',
            render: (_: string, record: { created_at: string }) => <span>{moment(record.created_at).format('LLL')}</span>,
        },
        {
            title: 'Update Date',
            dataIndex: 'updated_on',
            key: 'updated_on',
            render: (_: string, record: { updated_on: string }) => <span>{moment(record.updated_on).format('LLL')}</span>,
        },
        {
            title: 'Visibility',
            dataIndex: 'visibility',
            key: 'visibility',
            render: (_: string, record: { visibility: string }) => {
                const visibilityText = record.visibility.toUpperCase();
                const isPublic = visibilityText === 'PUBLIC';

                return (
                    <span className={`uppercase ${isPublic ? 'text-green-600' : 'text-red-600'}`}>
                        {visibilityText} {isPublic ? '🌐' : '🔒'}
                    </span>
                );
            },
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: void) => (
                <span>
                    <Button type="link" onClick={() => handleEdit(record.id)}>
                        <EditIcon />
                    </Button>
                    <Popover
                        open={visiblePopoverId === record.id}
                        onOpenChange={(visible) => {
                            if (!visible) setVisiblePopoverId(null);
                        }}
                        content={
                            <div>
                                <h1>Are you sure you want to delete this activity ?</h1>

                                <div className="flex justify-end gap-2 p-2">
                                    <Button>Cancel</Button>
                                    <Button onClick={() => handleDelete(record.id)} className="bg-red-500 text-white">
                                        Yes
                                    </Button>
                                </div>
                            </div>
                        }
                    >
                        <Button onClick={() => setVisiblePopoverId(record.id)} type="link" className="text-red-600">
                            <TrashIcon />
                        </Button>
                    </Popover>
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeaderWithBreadcrumb
                crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Blogs', href: '/admin/blogs/all' }, { title: 'All blogs' }]}
                title={`All Blogs (${totalActivities})`}
                description="Find all blogs information here."
            />

            <div className="h-full w-full bg-white ">
                <div className="my-4 p-4">
                    <Input onChange={onInputChange} className="h-12 text-xl font-semibold text-gray-800 placeholder:text-xl" placeholder="Search title, description, type, visibility" />
                </div>
                <Spin spinning={loading}>
                    <Table bordered scroll={{ x: 1200, y: 700 }} columns={columns} dataSource={blogs} rowKey="id" pagination={false} />
                </Spin>
                <div className="flex items-center justify-center py-10">
                    <Pagination
                        hideOnSinglePage
                        showTotal={(total) => `Total ${total} items`}
                        current={page}
                        pageSize={pageSize}
                        total={totalActivities}
                        onChange={(page, pageSize) => handleTableChange(page, pageSize)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ActivitiesAll;
