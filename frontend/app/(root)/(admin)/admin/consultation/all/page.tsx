'use client';
import { useEffect, useState } from 'react';
import { Table, Modal, Button, Pagination, Input, Spin, Switch, Select, Form, Tag, Descriptions } from 'antd';
import PageHeaderWithBreadcrumb from '@/components/utils/pageHeaderwithBreadcrumb';
import { getCookie } from '@/components/layouts/header';
import { formatDateTime, formatTwoDate } from '@/utils';
import { debounce } from 'lodash';
import { Edit3Icon } from 'lucide-react';
import { PhoneOutlined } from '@ant-design/icons';
import moment from 'moment';

interface RecordType {
    preferred_date: string;
    preferred_time: string;
    appointment_till_date: string;
    appointment_till_time: string;
    appointmentstatus: 'attended' | 'not_attended' | 'cancelled';
}

const AllConsultation = () => {
    const [form] = Form.useForm();
    const [consultationData, setConsultationData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearch] = useState('');

    const [pageSize, setPageSize] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setButtonLoading] = useState(false);
    const [paymentModal, setPaymentDetailModal] = useState(false);
    const [showModalfix, setShowModal] = useState(false);

    useEffect(() => {
        fetchData(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize]);

    const fetchData = async (page: any, pageSize: any, searchTerm: any) => {
        const token = getCookie('tokenSagartech');

        try {
            const response = await fetch(`${process.env.ADMINURL}/api/consultation?page=${parseInt(page)}&pageSize=${parseInt(pageSize)}&search=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const { data, total } = await response.json();
                setConsultationData(data);
                setTotalRecords(total);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    const calculateBirthYear = (age: number): number => {
        const currentYear = new Date().getFullYear();
        return currentYear - age;
    };

    const columns = [
        {
            title: '',
            width: 80,

            render: (_: string, record: any) => {
                return <Edit3Icon onClick={() => handleUpdate(record)} className=" cursor-pointer text-green-700" />;
            },
        },
        {
            title: 'Sr.No',
            key: 'id',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: 'Appointment Date & Time',
            key: 'appointment_date_time',
            width: 300,
            render: (text: string, record: any) => {
                try {
                    const { start, end, endDateTime, startDateTime } = formatTwoDate(record.preferred_date, record.preferred_time, record.appointment_till_date, record.appointment_till_time);
                    console.log(start, end, endDateTime, startDateTime, 'start, end, endDateTime, startDateTime');
                    
                    const statusColors: Record<RecordType['appointmentstatus'], string> = {
                        attended: 'green',
                        not_attended: 'red',
                        cancelled: 'orange',
                    };
                    const sessionDuration = Math.abs(endDateTime.getTime() - startDateTime.getTime()) / 36e5; // duration in hours

                    return (
                        <div className="flex flex-col gap-1">
                            <h2>
                                <b>Start: </b>
                                {start}
                            </h2>
                            <h2>
                                <b>End: </b>
                                {end}
                            </h2>
                            <h2>
                                <b>Session: </b>
                                {sessionDuration.toFixed(1)} hours
                            </h2>
                            <div>
                                <Tag color={statusColors[record.appointmentstatus]} className=" capitalize">
                                    {record.appointmentstatus?.replace('_', ' ')}
                                </Tag>
                            </div>
                        </div>
                    );
                } catch (error) {
                    return 'Invalid date or time' + error;
                }
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            key: 'full_name',
            width: 300,
            render: (_: string, record: any) => {
                return (
                    <div>
                        <p>{_}</p>
                        <p>Email: {record?.email_address ? <a href={`mailto:${record?.email_address}`}>{record?.email_address || 'N/A'}</a> : 'N/A'}</p>
                    </div>
                );
            },
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: 150,
            render: (text: string, record: any) => {
                const { city, state, country } = record;
                const fullAddress = [city, state, country].filter(Boolean).join(', ');

                return (
                    <div>
                        <p>{fullAddress}</p>
                    </div>
                );
            },
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: 100,
            render: (age: number) => {
                const birthYear = calculateBirthYear(age);
                return (
                    <div>
                        {age} ({birthYear})
                    </div>
                );
            },
        },

        {
            title: 'Contact Number',
            dataIndex: 'contact_number',
            width: 150,
            key: 'contact_number',
            render: (text: string) => <a href={`tel:${text}`}>{text}</a>, // Add a link with the tel protocol to initiate a phone call
        },
        {
            title: 'Payment Details',
            dataIndex: 'paymentDetails',
            key: 'paymentDetails',
            width: 180,
            render: (_, record: any) => (
                <div className="mb-4 flex flex-col items-center justify-center rounded-lg border p-4">
                    <p className="mb-2">
                        <strong>Mode:</strong> {record.payment_mode || 'N/A'}
                    </p>
                    <p className="mb-2">
                        <strong>Status:</strong> {record?.payment_status}
                    </p>
                    <p className="mb-2">
                        <strong>Amount:</strong> {record?.payment_amount}
                    </p>

                    <button
                        className="text-blue-500 underline hover:text-blue-700"
                        onClick={() => {
                            setSelectedRecord(record);
                            setPaymentDetailModal(true);
                        }}
                    >
                        View
                    </button>
                </div>
            ),
        },

        { title: 'Purpose of Yoga', width: 150, dataIndex: 'purpose_of_yoga', key: 'purpose_of_yoga' },
        {
            title: 'Action',
            key: 'action',
            width: 150,

            render: (text: string, record: any) => (
                <div>
                    <Button type="link" onClick={() => showModal(record)}>
                        View Details
                    </Button>
                </div>
            ),
        },
    ];

    const handleUpdate = (record: any) => {
        setSelectedRecord(record);
        setShowModal(true);
        form.setFieldsValue({ appointmentstatus: record?.appointmentstatus, additionaltext: record?.additionaltext });
    };

    const showModal = (record: any) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    };

    const handleSearch = debounce((text: string) => {
        fetchData(1, 10, text);
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleSearch(value);
    };

    const statusColors = {
        attended: 'green',
        not_attended: 'red',
        cancelled: 'orange',
    };

    return (
        <div>
            <PageHeaderWithBreadcrumb
                crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Consultation', href: '/admin/consultation/all' }, { title: 'All Consultation' }]}
                title={`All Consultation (${totalRecords})`}
                description="Find all consultation information here."
            />
            <div className="h-full w-full bg-white ">
                <div className="my-4 p-4">
                    <Input onChange={onInputChange} className="h-12 text-xl font-semibold text-gray-800 placeholder:text-xl" placeholder="Search customer name, contact number" />
                </div>
                <Spin spinning={loading}>
                    <Table scroll={{ x: 1200, y: 700 }} columns={columns} dataSource={consultationData} rowKey="id" pagination={false} />
                </Spin>
                <div className="flex items-center justify-center py-10">
                    <Pagination
                        hideOnSinglePage
                        showTotal={(total) => `Total ${total} items`}
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalRecords}
                        onChange={(page, pageSize) => handleTableChange(page, pageSize)}
                    />
                </div>
            </div>

            <Modal
                title="Consultation Details"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                {selectedRecord && (
                    <>
                        <div className="my-5 flex justify-between">
                            <p className="italic">
                                Last updated on: {formatDateTime(selectedRecord?.appointmentendedbyadmintime ? selectedRecord?.appointmentendedbyadmintime : selectedRecord?.created_at)}
                            </p>
                            <div className="flex flex-col items-center justify-center text-center">
                                <Tag color={statusColors[selectedRecord?.appointmentstatus]} className="capitalize">
                                    {selectedRecord?.appointmentstatus?.replace('_', ' ')}
                                </Tag>
                                <div className="py-2">
                                    {(selectedRecord?.appointmentstatus === 'cancelled' || selectedRecord?.appointmentstatus === 'not_attended') && (
                                        <a href={`tel:${selectedRecord?.contact_number}`} className="flex items-center text-blue-500 hover:text-blue-700">
                                            <PhoneOutlined className="mr-1" />
                                            {selectedRecord?.contact_number}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Descriptions bordered column={2} layout="vertical">
                            <Descriptions.Item label="Full Name">{selectedRecord?.full_name}</Descriptions.Item>
                            <Descriptions.Item label="Age">{selectedRecord?.age}</Descriptions.Item>
                            <Descriptions.Item label="Contact Number">{selectedRecord?.contact_number}</Descriptions.Item>
                            <Descriptions.Item label="Alternate Mobile Number">{selectedRecord?.alternate_mobile_number}</Descriptions.Item>
                            <Descriptions.Item label="Diet Preference">{selectedRecord?.diet_preference}</Descriptions.Item>
                            <Descriptions.Item label="Zodiac Sign">{selectedRecord?.zodiac_sign}</Descriptions.Item>
                            <Descriptions.Item label="Relationship Status">{selectedRecord?.relationship_status}</Descriptions.Item>
                            <Descriptions.Item label="Medicine Consumption">{selectedRecord?.medicine_consumption}</Descriptions.Item>
                            <Descriptions.Item label="Disorders or Disease">{selectedRecord?.disorders_or_disease}</Descriptions.Item>
                            <Descriptions.Item label="Purpose of Yoga">{selectedRecord?.purpose_of_yoga}</Descriptions.Item>
                            <Descriptions.Item label="Personal Notes">{selectedRecord?.personal_notes}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>

            <Modal
                title="Update Appointment Status"
                open={showModalfix}
                footer={null}
                onCancel={() => {
                    setShowModal(false);
                    setSelectedRecord(null);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        try {
                            setButtonLoading(true);
                            const token = getCookie('tokenSagartech');
                            const id = selectedRecord?.id; // Assuming selectedRecord contains the ID

                            const response = await fetch(`${process.env.ADMINURL}/api/update-consultation/${id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(values),
                            });

                            if (response.ok) {
                                // Handle success
                                console.log('Appointment status updated successfully');

                                // Assuming the response includes the updated consultation object
                                const updatedConsultation = await response.json();

                                console.log(updatedConsultation, 'upad');

                                // Update the local state with the updated consultation object
                                setConsultationData((prevData) => {
                                    return prevData.map((item) => {
                                        if (item.id === updatedConsultation.consultation.id) {
                                            return updatedConsultation.consultation;
                                        } else {
                                            return item;
                                        }
                                    });
                                });
                                setShowModal(false);
                                // You can also update the UI or perform other actions here if needed
                            } else {
                                // Handle error
                                console.error('Failed to update appointment status');
                                // You can also show an error message or perform other actions here if needed
                            }
                        } catch (error) {
                            console.error('Error updating appointment status:', error);
                            // You can also show an error message or perform other actions here if needed
                        } finally {
                            setButtonLoading(false);
                        }
                    }}
                >
                    <Form.Item label="Appointment Status" name="appointmentstatus" className="mb-5">
                        <Select placeholder="Select Appointment Status" className="h-12 text-xl font-semibold placeholder:text-xl">
                            <Select.Option value="attended">Attended</Select.Option>
                            <Select.Option value="not_attended">Not Attended</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Additional Text" name="additionaltext">
                        <Input.TextArea rows={4} placeholder="Enter additional text here..." />
                    </Form.Item>
                    <Form.Item className="flex justify-end">
                        <Button loading={loadingButton} className="h-12 bg-blue-500 px-5 text-lg font-semibold text-white" htmlType="submit">
                            Update Record
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={paymentModal}
                title="Payment Details"
                onCancel={() => {
                    setPaymentDetailModal(false);
                    setSelectedRecord(null);
                }}
                footer={null}
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Payment Mode">{selectedRecord?.payment_mode || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Payment Status">{selectedRecord?.payment_status || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Payment Amount">{selectedRecord?.payment_amount || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Payment ID">{selectedRecord?.payment_id || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Payment">{selectedRecord?.payment_obj ? JSON.stringify(selectedRecord?.payment_obj) : 'N/A'}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </div>
    );
};

export default AllConsultation;
