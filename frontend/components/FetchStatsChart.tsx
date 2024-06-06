import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Monthly Stats Chart',
        },
    },
};

const FetchStatsChart: React.FC = () => {
    const [yearlyStats, setYearlyStats] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${process.env.ADMINURL}/api/monthlystats`);
                if (response.ok) {
                    const data = await response.json();

                    setLoading(false);

                    Object.entries(data.yearlyStats).forEach(([year, monthlyStats]) => {
                        const notAttendedData = labels.map((month) => (monthlyStats[month] ? monthlyStats[month].not_attended || 0 : 0));
                        const attendedData = labels.map((month) => (monthlyStats[month] ? monthlyStats[month].attended || 0 : 0));
                        const cancelledData = labels.map((month) => (monthlyStats[month] ? monthlyStats[month].cancelled || 0 : 0));

                        setYearlyStats({ notAttendedData, attendedData, cancelledData });
                        console.log(notAttendedData, attendedData, cancelledData);
                    });
                } else {
                    setError('Failed to fetch stats');
                }
            } catch (error) {
                setError('Error fetching stats: ' + error.message);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const data = {
        labels,
        datasets: [
            {
                label: 'Not Attended',
                data: yearlyStats?.notAttendedData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Attended',
                data: yearlyStats?.attendedData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Cancelled',
                data: yearlyStats?.cancelledData,
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 205, 86, 0.5)',
            },
        ],
    };
    // const data = { labels, datasets };

    return (
        <div>
            <Line options={options} data={data} />
        </div>
    );
};

export default FetchStatsChart;
