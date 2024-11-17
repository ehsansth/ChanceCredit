'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import logo from '../images/fullLogo.png';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Button } from "@nextui-org/react";
import axios from 'axios';

export default function Dashboard() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const [userName, setUserName] = useState(''); // To dynamically set the user name
    const [creditScore, setCreditScore] = useState<number | null>(null); // To dynamically set the credit score
    const [error, setError] = useState<string | null>(null);

    const barData = [
        { month: 'Jun', amount: 280.45 },
        { month: 'Jul', amount: 130.22 },
        { month: 'Aug', amount: 205.67 },
        { month: 'Sep', amount: 25.89 },
        { month: 'Oct', amount: 142.15 },
        { month: 'Nov', amount: 57.91 }
    ];
    const avg = (barData.reduce((sum, entry) => sum + entry.amount, 0) / barData.length).toFixed(2);

    const percentage = ((creditScore - 300) / (850 - 300)) * 100;

    const data = [
        {
            name: 'score',
            value: percentage,
            fill: getScoreColor(creditScore)
        }
    ];

    function getScoreColor(score: number): string {
        if (score >= 750) return '#22c55e';
        if (score >= 670) return '#3b82f6';
        if (score >= 580) return '#eab308';
        return '#ef4444';
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError('Good morning, User');
                return;
            }

            try {
                // Make an API call to fetch user data
                const response = await axios.post('http://127.0.0.1:5001/get_user', { id: userId });
                const { user } = response.data;

                // Update state with user data
                setUserName(user.name);
                setCreditScore(user.score);
                setError(null); // Clear errors if data is successfully fetched
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError('Failed to fetch user data. Please try again later.');
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <div className="min-h-screen font-sans bg-sky-50">
            <nav className="flex items-center justify-between px-12 py-4 bg-white drop-shadow-md fixed top-0 right-0 left-0 z-50">
                <Link href="/">
                    <Image
                        src={logo}
                        alt="ChanceCredit Logo"
                        width={300}
                    />
                </Link>
            </nav>

            <main className="bg-sky-50 pt-16">
                <div className="flex-1 px-8 py-16 flex gap-8">                 {/* Contains All Boxes */}
                    <div className='flex-1'>                                                    {/* Left Side */}
                        <div className="shadow bg-white rounded-lg py-16">
                            <h1 className="text-center text-5xl font-bold text-gray-800">       {/* GM Anthony */}
                                {error ? (
                                    <span className="text-red-600">{error}</span>
                                ) : (
                                    `Good Morning, ${userName || 'User'} 👋`
                                )}
                            </h1>
                        </div>
                        <div className="shadow bg-white rounded-lg p-8 mt-8">                   {/* Payments Box */}
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                                Current Payments
                            </h1>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-gray-600">Total Remaining</p>
                                        <p className="text-2xl font-bold text-gray-800">$648.85</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Active Items</p>
                                        <p className="text-2xl font-bold text-gray-800">3</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Refrigerator</h3>
                                                <p className="text-sm text-gray-600">Monthly Payment</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                On Time
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="text-sm text-gray-600">
                                                <p>Next Payment: Dec 1, 2024</p>
                                                <p>Remaining: 8 payments</p>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800">$79.99/month</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Laptop</h3>
                                                <p className="text-sm text-gray-600">Weekly Payment</p>
                                            </div>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                                Due Soon
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="text-sm text-gray-600">
                                                <p>Next Payment: Nov 25, 2024</p>
                                                <p>Remaining: 5 payments</p>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800">$24.99/week</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Winter Tire Set</h3>
                                                <p className="text-sm text-gray-600">Bi-weekly Payment</p>
                                            </div>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                Just Paid
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="text-sm text-gray-600">
                                                <p>Next Payment: Dec 15, 2024</p>
                                                <p>Remaining: 3 payments</p>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800">$45.99/2 weeks</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center pt-4">
                                    <Button variant="ghost" className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden text-sky-700 font-bold px-5 py-2 rounded-full transition w-fit active:translate-y-0 active:shadow-none border-2 border-sky-700 hover:bg-sky-700 hover:text-white">
                                        Full Payment History →
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">                                                    {/* Right Side */}
                        <div className='shadow bg-white flex-1 rounded-lg p-8 pb-16'>                  {/* Balance Box */}
                            <div className="flex mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        Your Balance
                                    </h1>
                                    <p className="text-7xl font-normal mt-4 mb-8 text-sky-700">
                                        $862.23
                                    </p>
                                    <h2 className="text-2xl font-semibold">
                                        Monthly Income
                                    </h2>
                                </div>
                            </div>
                            <div className="h-72 mt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: '#6B7280' }}
                                        />
                                        <YAxis
                                            domain={['auto', 'auto']}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '0.5rem'
                                            }}
                                            formatter={(value) => [`$${value}`]}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            fill="#0369a1"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <ReferenceLine y={avg} stroke="gray" strokeDasharray="5 4" />
                                    </BarChart>
                                </ResponsiveContainer>
                                <h3 className="text-xl mt-2">
                                    Average Monthly Income: <span className="font-bold">${avg}</span> (last 6 months)
                                </h3>
                            </div>
                        </div>
                        <div className='shadow bg-white flex-1 rounded-lg p-8 mt-8'>             {/* Credit Box */}
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">
                                            Your Credit
                                        </h1>
                                        <p className="text-gray-600 mt-1">Updated Nov 17, 2024</p>
                                    </div>
                                    <Button variant="ghost" className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden text-sky-700 font-bold px-5 py-2 rounded-full transition w-fit active:translate-y-0 active:shadow-none border-2 border-sky-700 hover:bg-sky-700 hover:text-white">
                                        View Details →
                                    </Button>
                                </div>
                                <div className="flex flex-col items-center relative">
                                    <RadialBarChart
                                        width={256}
                                        height={160}
                                        cx={128}
                                        cy={100}
                                        innerRadius={80}
                                        outerRadius={100}
                                        barSize={10}
                                        data={data}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <PolarAngleAxis
                                            type="number"
                                            domain={[0, 100]}
                                            angleAxisId={0}
                                            tick={false}
                                        />
                                        <RadialBar
                                            background
                                            dataKey="value"
                                            angleAxisId={0}
                                            data={[data[0]]}
                                            cornerRadius={5}
                                        />
                                    </RadialBarChart>
                                    <div className="absolute top-16 flex flex-col items-center">
                                    <p className="text-4xl font-bold text-gray-800">{creditScore || '---'}</p>
                                        <p className="text-sm text-gray-600">Credit Score</p>
                                    </div>
                                    <div className="flex justify-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="text-sm">Poor<br />300-579</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <span className="text-sm">Fair<br />580-669</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm">Good<br />670-739</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm">Excellent<br />740-850</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className='flex items-center justify-center py-4 bg-sky-50 border-t border-gray-400 mx-64'>
                <p>
                    By Ehsan Ahmed, Anthony Dang, Van Thiang, and Vincent Dang @ HackUTD 2024: Ripple Effect
                </p>
            </footer>
        </div>
    );
}