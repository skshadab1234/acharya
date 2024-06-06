'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Col, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PageHeaderWithBreadcrumb from '@/components/utils/pageHeaderwithBreadcrumb';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

const { Option } = Select;

const ManageBlogs = () => {
    const [form] = Form.useForm();
    const search = useSearchParams();
    const id = search.get('id');
    const [mediaFileList, setMediaFileList] = useState([]);
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [typeupload, setTypes] = useState([]);
    const [loader, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (id) {
            // Fetch the activity details by id and set the form values
            // Assuming fetchBlogs is a function to fetch activity details
            fetchBlogs(id).then((activity) => {
                console.log(activity, 'asas');
                if (!activity.status) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: activity.message,
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Redirect the user back to the previous page or perform any other action
                            window.history.back();
                        }
                    });
                }

                const mediaFile = activity.result.media_url
                    ? {
                          uid: '-1',
                          name: activity.result.media_url,
                          status: 'done',
                          type: 'media',
                          url: `${process.env.ADMINURL}/uploads/activity/${activity.result.media_url}`,
                      }
                    : null;

                const thumbnailFile = activity.result.thumbnail_url
                    ? {
                          uid: '-2',
                          name: activity.result.thumbnail_url,
                          status: 'done',
                          type: 'thumbnail',

                          url: `${process.env.ADMINURL}/uploads/activity/${activity.result.thumbnail_url}`,
                      }
                    : null;

                setMediaFileList(mediaFile ? [mediaFile] : []);
                setThumbnailFileList(thumbnailFile ? [thumbnailFile] : []);

                form.setFieldsValue(activity.result);
            });
        }
    }, [id]);

    const fetchBlogs = async (id: number) => {
        try {
            const response = await fetch(`${process.env.ADMINURL}/api/getBlogs?id=${id}`);
            const activity = await response.json();
            return activity;
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (values) => {
        const formdata_value = { ...values, media_url: mediaFileList?.[0], thumbnail_url: thumbnailFileList?.[0] };
        setLoading(true);
        // Combine form data with uploaded file URLs
        const formData = new FormData();
        formData.append('title', formdata_value.title);
        formData.append('short_description', formdata_value.short_description);
        formData.append('description', formdata_value.description);
        formData.append('type', formdata_value.type);
        formData.append('file', formdata_value?.media_url); // Append the media URL
        formData.append('file', formdata_value?.thumbnail_url); // Append the media URL
        formData.append('typeupload', typeupload); // Append the media URL
        formData.append('id', id);

        try {
            const response = await fetch(`${process.env.ADMINURL}/api/addblogs`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                message.success(`${id ? 'Blogs updated successfully' : 'Blogs added successfully'}`);
                // Optionally, you can perform further actions after successful submission
                router.push('/admin/blog/all');
            } else {
                throw new Error('Failed to add blogs');
            }
        } catch (error) {
            console.error('Error adding blogs:', error);
            message.error('Failed to add blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleBeforeUpload = (file, setUrl, type) => {
        // Check if the file type is already present in the typeupload array
        const isTypeAlreadyUploaded = typeExistsInState(type);

        console.log(isTypeAlreadyUploaded, 'isTypeAlreadyUploaded');

        // Check file type before uploading
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
        const isVideo = file.type === 'video/mp4' || file.type === 'video/webm';

        // If the condition is met, allow upload and update the corresponding URL state
        if (isImage || isVideo) {
            setUrl([file]);
            if (!isTypeAlreadyUploaded) {
                setTypes([...typeupload, type]);
            }
            return true;
        } else {
            message.error('You can only upload JPG/PNG images or MP4/WEBM videos!');
            return false;
        }
    };

    // Function to check if the type already exists in the state
    const typeExistsInState = (type) => {
        return typeupload.includes(type);
    };

    const countCharacters = (str) => {
        return str ? str.trim().length : 0;
    };

    return (
        <div className="bg-white p-4">
            <PageHeaderWithBreadcrumb
                crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Blogs', href: '/admin/blogs/all' }, { title: `${id ? 'Edit' : 'Create'} Blogs` }]}
                title={`${id ? 'Edit' : 'Create'} Blogs`}
                description=""
            />

            <div className="container w-full md:max-w-3xl">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
                                <Input className="h-12 " />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select the type' }]}>
                                <Select className="h-12" placeholder="Select a type">
                                    <Option value="Yoga">Yoga</Option>
                                    <Option value="Meditation">Meditation</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="short_description"
                                label="Short Description"
                                extra={'Short description length is 250 characters.'}
                                rules={[
                                    { required: true, message: 'Please enter the short description' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (countCharacters(value) <= 250) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Short description cannot exceed 250 characters'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: 'Please enter the Long description' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (countCharacters(value) <= 4000) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Long description cannot exceed 4000 characters'));
                                        },
                                    }),
                                ]}
                                name="description"
                                label="Description"
                                extra={'Long description cannot exceed 4000 characters'}
                            >
                                <Input.TextArea rows={10} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="media_url" label="Upload Media">
                                <Upload
                                    onRemove={() => setMediaFileList([])}
                                    fileList={mediaFileList}
                                    listType="picture"
                                    name="media_url"
                                    accept=".jpg,.png,.mp4,.webm"
                                    beforeUpload={(file) => handleBeforeUpload(file, setMediaFileList, 'media')}
                                >
                                    {mediaFileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="thumbnail_url" label="Upload Thumbnail">
                                <Upload
                                    onRemove={() => setThumbnailFileList([])}
                                    fileList={thumbnailFileList}
                                    listType="picture"
                                    name="thumbnail_url"
                                    accept=".jpg,.png"
                                    beforeUpload={(file) => handleBeforeUpload(file, setThumbnailFileList, 'thumbnail')}
                                >
                                    {thumbnailFileList.length === 0 && <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="center" className="sticky bottom-0 top-10 flex h-full items-center justify-center bg-white p-2">
                        <Col>
                            <Form.Item>
                                <Button loading={loader} className="h-12 bg-blue-500 text-white" htmlType="submit">
                                    {id ? 'Update' : 'Create'} Blogs
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default ManageBlogs;
