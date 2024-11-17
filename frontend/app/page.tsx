'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import logo from './images/fullLogo.png';
import { Button } from "@nextui-org/react";

export default function Home() {
  const router = useRouter();

  const handleCheckRateClick = () => {
    router.push('/questionnaire'); // Navigate to the questionnaire page
  };

  return (
    <div className="min-h-screen font-sans">
      <nav className="flex items-center justify-between px-12 py-4 bg-white border-b border-lightgrey fixed top-0 right-0 left-0 z-50">
        <Link href="/">
          <Image
            src={logo}
            alt="ChanceCredit Logo"
            width={300}
          />
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/login" className="px-4 py-2 text-xl text-teal-600 hover:text-teal-700 font-bold">
            LOG IN
          </Link>
        </div>
      </nav>

      <main className="relative bg-[#f5fbfb] px-8 py-16 md:py-24 mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
              Now is Your <span className="font-bold">Chance</span>
            </h1>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>Something something</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>Something something</span>
              </div>
            </div>

            <Button
              onClick={handleCheckRateClick}
              className="transition-transform transform hover:-translate-y-1 hover:shadow overflow-hidden bg-sky-500 text-3xl text-white font-bold px-8 py-4 rounded-full transition w-fit"
            >
              Check your rate
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
