'use client';

import Image from "next/image";
import Link from "next/link";
import logo from '../images/fullLogo.png';
import help from '../images/help.png';
import { Button } from "@nextui-org/react";

export default function Home() {
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

            <main className="flex">
                <div className="bg-sky-700 w-64 h-screen"></div>
                <div className="flex-1 bg-sky-50 px-8 py-16 mt-16 flex gap-8">
                    <div className='bg-white flex-1 rounded-lg p-8'>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Your Balance
                        </h1>
                        <p className="text-7xl font-normal my-4 text-sky-700">
                            $357.91
                        </p>
                    </div>
                    <div className='bg-white flex-1 rounded-lg p-8'>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Current Payments
                        </h1>
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