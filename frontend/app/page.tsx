'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import logo from './images/fullLogo.png';
import help from './images/help.png';
import { Button } from "@nextui-org/react";

export default function Home() {
  const router = useRouter();

  const handleCheckRateClick = () => {
    router.push('/questionnaire');
  };

  const handleLoginClick = () => {
    router.push('/dashboard');
  };

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
        <div className="flex items-center gap-8">
          <Button onClick={handleLoginClick}
            variant="ghost" className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden text-sky-700 font-bold px-5 py-2 rounded-full transition w-fit active:translate-y-0 active:shadow-none border-2 border-sky-700 hover:bg-sky-700 hover:text-white">
            LOG IN
          </Button>
        </div>
      </nav>

      <main className="relative bg-sky-50 px-8 py-16 md:py-24 mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
              Now is Your <span className="font-bold">Chance</span>
            </h1>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span className="text-bg">We'll help you get back on your feet.</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>Calculate your rate and make a plan today.</span>
              </div>
            </div>

            <Button
              onClick={handleCheckRateClick}
              className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden bg-sky-700 text-3xl text-white font-bold px-8 py-4 rounded-full transition w-fit active:translate-y-0 active:shadow-none">
              Check Your Rate
            </Button>
          </div>

          <div className="relative flex justify-center align-center">
            <Image
              src={help}
              alt="alt"
              width={450}
              height={450}
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        <div className="px-10 mt-8">
          <h2 className="text-2xl font-bold mb-6">Something something something</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Minimum Balance Requirements</h3>
              <p className="text-gray-600">Description</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Identity Verification</h3>
              <p className="text-gray-600">Description</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              </div>
              <h3 className="text-xl font-bold mb-2">Top-Quality Financial Assistance</h3>
              <p className="text-gray-600">Description</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              </div>
              <h3 className="text-xl font-bold mb-2">Proven Successful Results</h3>
              <p className="text-gray-600">Description</p>
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