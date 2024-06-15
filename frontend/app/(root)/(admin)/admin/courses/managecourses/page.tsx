'use client';
import React, { useState, useEffect } from 'react';
import { Steps, Form, Input, Button, Upload, message, Checkbox, Row, Col, Select, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PageHeaderWithBreadcrumb from '@/components/utils/pageHeaderwithBreadcrumb';

const { Step } = Steps;

const ManageCourses = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0); // State to manage current step of the form
    const [formData, setFormData] = useState(() => {
        // Initialize form data from localStorage or defaults
        const storedFormData = JSON.parse(localStorage.getItem('formData')) || {};
        return storedFormData;
    });

    useEffect(() => {
        form.setFieldsValue(formData);
        // Save formData to localStorage whenever it changes
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const requiredFields = ['title', 'description', 'price', 'chapters'];

    const handleSubmit = async (values) => {
        // Merge form data with existing formData
        const updatedFormData = { ...formData, ...values };

        // Check for missing required fields
        const missingFields = requiredFields.filter((field) => !updatedFormData[field]);

        // Additional check for empty chapters array
        if (updatedFormData?.chapters?.length === 0) {
            missingFields.push('chapters');
        }

        if (currentStep + 1 === stepsContent?.length) {
            if (missingFields.length > 0) {
                alert(`Missing required fields: ${missingFields.join(', ')}`);
                return;
            }
            await insertCourseForm(updatedFormData);
            // Update state to trigger re-render and save to localStorage
        } else {
            setFormData(updatedFormData);
            setCurrentStep(currentStep + 1);
        }
    };

    const insertCourseForm = async (updatedFormData) => {
        console.log(updatedFormData);

        const formData = new FormData();
        formData.append('course_thumbnail', updatedFormData.course_thumbnail?.fileList[0].originFileObj);
        formData.append('data', JSON.stringify(updatedFormData));
        // Append all form data fields

        try {
            const response = await fetch(`${process.env.ADMINURL}/api/addCourses`, {
                method: 'POST',
                headers: {
                    // Do not set Content-Type header to allow browser to set the correct boundary for multipart/form-data
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            message.success('Course added successfully!');
        } catch (error) {
            console.log(error);
            message.error(`Failed to add course: ${error.message}`);
        }
    };

    // Handle file upload for custom thumbnail
    const handleThumbnailUpload = (file) => {
        setFormData({ ...formData, course_thumbnail: file });
    };

    // Steps content
    const stepsContent = [
        {
            title: 'Basic Information',
            content: (
                <Form form={form} name="basic" className="mt-10" onFinish={handleSubmit}>
                    {/* Title and Description in a single row on larger screens */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
                                <Input className="h-12 text-xl text-gray-800" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Description" name="description">
                                <Input.TextArea rows={9} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Custom Thumbnail in a separate row */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Custom Thumbnail"
                                name="course_thumbnail"
                                rules={[{ required: true, message: 'Please upload a custom thumbnail!' }]}
                                extra="Upload an image file (jpg, png, gif) for the course thumbnail. Max file size: 2MB."
                            >
                                <Upload
                                    fileList={formData?.course_thumbnail ? [formData?.course_thumbnail] : []}
                                    listType="picture-card"
                                    accept="image/*"
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        handleThumbnailUpload(file);
                                        return false;
                                    }}
                                    onRemove={() => {
                                        setFormData({ ...formData, course_thumbnail: null });
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}></Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Submit Button aligned to the right */}
                    <Row justify={'center'} className="mt-10">
                        <button
                            className="cursor-pointer rounded-lg border-b-[4px] border-blue-600 bg-blue-500 px-6 py-2
text-white
transition-all hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110
active:translate-y-[2px] active:border-b-[2px] active:brightness-90"
                        >
                            Next
                        </button>
                    </Row>
                </Form>
            ),
        },

        {
            title: 'Add Chapters',
            content: (
                <Form form={form} name="addChapters" onFinish={handleSubmit}>
                    <Form.List
                        name="chapters"
                        rules={[
                            {
                                validator: async (_, chapters) => {
                                    if (!chapters || chapters.length < 1) {
                                        return Promise.reject(new Error('At least one chapter must be added'));
                                    }
                                },
                            },
                        ]}
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} className="mb-4">
                                        <Form.Item
                                            {...restField}
                                            label={`Chapter Title ${key + 1}`}
                                            name={[name, 'title']}
                                            fieldKey={[fieldKey, 'title']}
                                            labelAlign="left"
                                            labelCol={{ xs: 12, sm: 4, md: 4 }}
                                            rules={[{ required: true, message: 'Please input the chapter title!' }]}
                                        >
                                            <Input className="h-12 text-xl text-gray-800" />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            label={`Chapter Description ${key + 1}`}
                                            name={[name, 'description']}
                                            fieldKey={[fieldKey, 'description']}
                                            rules={[{ required: true, message: 'Please input the chapter description!' }]}
                                            labelCol={{ xs: 12, sm: 4, md: 4 }}
                                            labelAlign="left"
                                        >
                                            <Input.TextArea />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            label={`Upload Video ${key + 1}`}
                                            name={[name, 'video_link']}
                                            fieldKey={[fieldKey, 'video']}
                                            valuePropName="fileList"
                                            labelAlign="left"
                                            labelCol={{ xs: 12, sm: 4, md: 4 }}
                                            getValueFromEvent={(e) => {
                                                if (Array.isArray(e)) {
                                                    return e;
                                                }
                                                return e && e.fileList;
                                            }}
                                            rules={[{ required: true, message: 'Please upload a video!' }]}
                                        >
                                            <Upload listType="picture-card" maxFileSize={100 * 1024 * 1024} accept="video/*" maxCount={1} beforeUpload={() => false}>
                                                <Button icon={<UploadOutlined />}></Button>
                                            </Upload>
                                        </Form.Item>

                                        <Button type="link" onClick={() => remove(name)}>
                                            Remove Chapter
                                        </Button>
                                    </div>
                                ))}
                                <Form.Item className="flex h-[150px] items-center justify-center">
                                    {/* <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Add Chapter
                                    </Button> */}
                                    <button type="button" title="Add" onClick={() => add()} className="cssbuttons-io-button">
                                        <svg height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path>
                                        </svg>
                                        <span>Add New Chapter</span>
                                    </button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item className="sticky bottom-0 flex items-center justify-center space-x-4 bg-white py-10 shadow-lg">
                        {/* <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button> */}
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="cursor-pointer rounded-lg border border-b-2 border-gray-300  px-6 py-2
text-gray-800
transition-all hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110
active:translate-y-[2px] active:border-b-[2px] active:brightness-90"
                        >
                            Previous
                        </button>
                        <button
                            type="submit"
                            className="ml-5 cursor-pointer rounded-lg border-b-[4px] border-blue-600 bg-blue-500 px-6
py-2
text-white transition-all hover:-translate-y-[1px] hover:border-b-[6px]
hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] active:brightness-90"
                        >
                            Next
                        </button>
                    </Form.Item>
                </Form>
            ),
        },

        {
            title: 'Course Details',
            content: (
                <Form form={form} name="courseDetails" className="mt-10" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        {/* First Column */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item labelAlign="left" labelCol={{ xs: 12, sm: 4, md: 4 }} label="Old Price" name="old_price">
                                <InputNumber className="flex h-12 items-center justify-center text-xl" placeholder="450.5" />
                            </Form.Item>
                        </Col>

                        {/* Second Column */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                labelAlign="left"
                                labelCol={{ xs: 12, sm: 4, md: 4 }}
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: 'Please input the price!' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value > 10000) {
                                                return Promise.reject('Price cannot exceed Rs.10,000!');
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <InputNumber className="flex h-12 items-center justify-center text-xl" placeholder="210.5" />
                            </Form.Item>
                        </Col>

                        {/* Third Column */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Is Free" name="isfree" valuePropName="checked">
                                <Checkbox />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        {/* Fourth Column */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item labelAlign="left" labelCol={{ xs: 12, sm: 4, md: 4 }} label="Duration" name="duration">
                                <Input className="h-12" placeholder="35 minutes" />
                            </Form.Item>
                        </Col>

                        {/* Fifth Column */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item labelAlign="left" labelCol={{ xs: 12, sm: 4, md: 4 }} label="Level" name="level">
                                <Select className="h-12">
                                    <Select.Option value="beginner">Beginner</Select.Option>
                                    <Select.Option value="intermediate">Intermediate</Select.Option>
                                    <Select.Option value="advanced">Advanced</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Sixth Column */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Select Visibility" name="visibility">
                                <Select className="h-12" placeholder="Choose visibility">
                                    <Select.Option value="true">Public</Select.Option>
                                    <Select.Option value="'false'">Private</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Submit and Previous Buttons */}
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Form.Item className=" flex items-center justify-center space-x-4 bg-white py-10 shadow-lg">
                                {/* <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button> */}

                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="cursor-pointer rounded-lg border border-b-2 border-gray-300  px-6 py-2
text-gray-800
transition-all hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110
active:translate-y-[2px] active:border-b-[2px] active:brightness-90"
                                >
                                    Previous
                                </button>
                                <button
                                    className="ml-5 cursor-pointer rounded-lg border-b-[4px] border-blue-600 bg-blue-500 px-6
py-2
text-white transition-all hover:-translate-y-[1px] hover:border-b-[6px]
hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] active:brightness-90"
                                >
                                    Submit
                                </button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            ),
        },
    ];

    const handleChange = (current) => {
        setCurrentStep(current);
    };

    return (
        <div className="bg-white shadow-sm">
            <PageHeaderWithBreadcrumb
                crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Courses', href: '/admin/courses/all' }, { title: 'Manage courses' }]}
                title={`Manage courses`}
                description="Manage courses information here."
            />

            <div className="border-t md:p-4">
                <Steps current={currentStep} onChange={handleChange}>
                    {stepsContent.map((step, index) => (
                        <Step key={index} title={step.title} />
                    ))}
                </Steps>
                <div className="mt-4">{stepsContent[currentStep]?.content}</div>
            </div>

            {/* Displaying form data from localStorage */}
            {/* <div className="mt-8 border-t p-4">
                <h2 className="mb-4 text-xl font-semibold">Stored Form Data</h2>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div> */}
        </div>
    );
};

export default ManageCourses;
