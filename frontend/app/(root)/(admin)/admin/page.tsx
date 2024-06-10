'use client';
import React, { useState, useEffect } from 'react';
import FetchStatsChart from '@/components/FetchStatsChart';
import { useRouter } from 'next/navigation';

const Home = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${process.env.ADMINURL}/api/consultstats`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
                } else {
                    console.error('Failed to fetch stats');
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const route = useRouter();
    const handleRedirection = (page: string, mode: string) => {
        route.push(`/admin/${page}${mode && `?mode=${mode}`}`);
    };
    return (
        <div className="container mt-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="cursor-pointer rounded-md bg-purple-200 p-4 hover:bg-purple-300" onClick={() => handleRedirection('consultation/all', 'today')}>
                    <h2 className="mb-2 text-xl font-bold text-purple-800">Today's Appointments</h2>
                    <p className="text-2xl font-semibold text-purple-600">{stats.today_appointments || 0}</p>
                </div>
                <div className="cursor-pointer rounded-md bg-green-200 p-4 hover:bg-green-300" onClick={() => handleRedirection('consultation/all', 'attended')}>
                    <h2 className="mb-2 text-xl font-bold text-green-800">Attended</h2>
                    <p className="text-2xl font-semibold text-green-600">{stats.attended || 0}</p>
                </div>
                <div className="cursor-pointer rounded-md bg-blue-200 p-4 hover:bg-blue-300" onClick={() => handleRedirection('consultation/all', 'not_attended')}>
                    <h2 className="mb-2 text-xl font-bold text-blue-800">Not Attended</h2>
                    <p className="text-2xl font-semibold text-blue-600">{stats.not_attended || 0}</p>
                </div>
                <div className="cursor-pointer rounded-md bg-yellow-200 p-4 hover:bg-yellow-300" onClick={() => handleRedirection('consultation/all', 'cancelled')}>
                    <h2 className="mb-2 text-xl font-bold text-yellow-800">Cancelled</h2>
                    <p className="text-2xl font-semibold text-yellow-600">{stats.cancelled || 0}</p>
                </div>
                <div className="cursor-pointer rounded-md bg-red-200 p-4 hover:bg-red-300" onClick={() => handleRedirection('consultation/all', '')}>
                    <h2 className="mb-2 text-xl font-bold text-red-800">Overall Appointments</h2>
                    <p className="text-2xl font-semibold text-red-600">{stats.total_appointment || 0}</p>
                </div>
                <div className="cursor-pointer rounded-md bg-indigo-200 p-4 hover:bg-indigo-300" onClick={() => handleRedirection('blog/all', '')}>
                    <h2 className="mb-2 text-xl font-bold text-indigo-800">Total Blogs</h2>
                    <p className="text-2xl font-semibold text-indigo-600">{stats.total_blogs || 0}</p>
                </div>
                <div className="cursor-pointer rounded-md bg-teal-200 p-4 hover:bg-teal-300" onClick={() => handleRedirection('activities/all', '')}>
                    <h2 className="mb-2 text-xl font-bold text-teal-800">Total Activities</h2>
                    <p className="text-2xl font-semibold text-teal-600">{stats.total_activities || 0}</p>
                </div>
            </div>

            <FetchStatsChart />
        </div>
    );
};

export default Home;
