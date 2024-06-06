'use client';
import React, { useState, useEffect } from 'react';
import FetchStatsChart from '@/components/FetchStatsChart';

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

    return (
        <div className="container mt-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-md bg-purple-200 p-4">
                    <h2 className="mb-2 text-xl font-bold text-purple-800">Today's Appointments</h2>
                    <p className="text-2xl font-semibold text-purple-600">{stats.today_appointments || 0}</p>
                </div>
                <div className="rounded-md bg-green-200 p-4">
                    <h2 className="mb-2 text-xl font-bold text-green-800">Attended</h2>
                    <p className="text-2xl font-semibold text-green-600">{stats.attended || 0}</p>
                </div>
                <div className="rounded-md bg-blue-200 p-4">
                    <h2 className="mb-2 text-xl font-bold text-blue-800">Not Attended</h2>
                    <p className="text-2xl font-semibold text-blue-600">{stats.not_attended || 0}</p>
                </div>
                <div className="rounded-md bg-yellow-200 p-4">
                    <h2 className="mb-2 text-xl font-bold text-yellow-800">Cancelled</h2>
                    <p className="text-2xl font-semibold text-yellow-600">{stats.cancelled || 0}</p>
                </div>
                <div className="rounded-md bg-red-200 p-4">
                    <h2 className="mb-2 text-xl font-bold text-red-800">Overall Appointment</h2>
                    <p className="text-2xl font-semibold text-red-600">{stats.total_appointment || 0}</p>
                </div>
            </div>
            <FetchStatsChart />
        </div>
    );
};

export default Home;
