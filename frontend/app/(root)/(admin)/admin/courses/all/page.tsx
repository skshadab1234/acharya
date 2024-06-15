'use client';

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Modal, Spin, Popover, message, Tag, Space, Card, Tooltip } from 'antd';
import PageHeaderWithBreadcrumb from '@/components/utils/pageHeaderwithBreadcrumb';
import { debounce } from 'lodash';
import moment from 'moment';
import { EditIcon, TrashIcon } from 'lucide-react';
import { getCookie } from '@/components/layouts/header';
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCourses, setTotalcourses] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visiblePopoverId, setVisiblePopoverId] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchcourses(page, pageSize, searchTerm);
    }, [page, pageSize]);

    const fetchcourses = async (page, pageSize, searchTerm) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ page: String(page), pageSize: String(pageSize), search: searchTerm }).toString();
            const response = await fetch(`${process.env.ADMINURL}/api/allcourses?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setCourses(data.courses);
            setTotalcourses(data.totalcourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
        setLoading(false);
    };

    const handleSearch = debounce((value: string) => {
        setSearchTerm(value);
        fetchcourses(1, 10, value);
        setPage(1); // Reset to the first page on new search
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    const handleEdit = (courseId: number) => {
        // Redirect to edit page or open modal for editing course
        console.log('Edit course', courseId);
        router.push(`/admin/courses/managecourses?course_id=${courseId}`);
    };

    const handleDelete = async (courseId: number) => {
        try {
            const response = await fetch(`${process.env.ADMINURL}/api/deletecourses`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + getCookie('tokenSagartech'),
                },
                body: JSON.stringify({ id: courseId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete course');
            }

            console.log('Delete course', courseId);

            // Optionally, you might want to fetch the updated list of courses from the server
            // after deletion to ensure you have the latest data.
            // For now, we assume we can filter out the deleted course from the current state.
            message.success('course Deleted Successfully!');
            setCourses((prevCourse) => prevCourse.filter((course) => course.id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error);
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

    const CourseCard = ({ course }) => (
        <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-800">
            <img className="h-48 w-full object-cover" src={course.course_thumbnail} alt="Course Thumbnail" />
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-40 "></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-center text-white">
                    <div className="mr-4 rounded-md bg-slate-900 p-2 shadow-lg">
                        <Tooltip title="Edit Course">
                            <EditOutlined style={{ fontSize: '2.5em' }} />
                        </Tooltip>
                    </div>
                    <div className="rounded-md bg-red-500 p-2">
                        <Tooltip title="Delete Course">
                            <DeleteOutlined style={{ fontSize: '2.5em' }} />
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
                <p className="mb-4 text-gray-800 dark:text-gray-300">{course.description}</p>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">Instructor: {course.instructor}</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-200">${parseFloat(course.price).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <PageHeaderWithBreadcrumb
                crumbs={[{ title: 'Home', href: '/admin' }, { title: 'courses', href: '/admin/courses/all' }, { title: 'All courses' }]}
                title={`All courses (${totalCourses})`}
                description="Find all courses information here."
            />

            <div className="h-full w-full ">
                <div className="my-4">
                    <Input onChange={onInputChange} className="h-12 text-xl font-semibold text-gray-800 placeholder:text-xl" placeholder="Search title, description, type, visibility" />
                </div>
                <div className="mb-4 py-2">
                    {searchTerm.trim() != '' && (
                        <h2 className="text-xl">
                            Showing {totalCourses} results for search <span className="font-semibold dark:text-white">"{searchTerm}"</span>
                        </h2>
                    )}
                </div>
                <Spin spinning={loading}>
                    <div className="grid grid-cols-2 gap-4 px-2 max-sm:grid-cols-1 lg:grid-cols-4">
                        {courses.map((course) => (
                            <CourseCard key={course.course_id} course={course} />
                        ))}
                    </div>
                </Spin>

                <div className="flex items-center justify-center py-10">
                    <Pagination
                        hideOnSinglePage
                        showTotal={(total) => `Total ${total} items`}
                        current={page}
                        pageSize={pageSize}
                        total={totalCourses}
                        onChange={(page, pageSize) => handleTableChange(page, pageSize)}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllCourses;
