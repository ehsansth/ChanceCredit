'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import logo from '../images/fullLogo.png';
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function QuestionnairePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssn: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Validate SSN format
    const ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;
    if (!ssnPattern.test(formData.ssn)) {
      setError('Please enter a valid Social Security Number.');
      return;
    }

    console.log('Form submitted:', formData);
    router.push('/results');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="bg-sky-50 min-h-screen font-sans">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-12 py-4 bg-white drop-shadow-md fixed top-0 right-0 left-0 z-50">
        <Link href="/">
          <Image src={logo} alt="ChanceCredit Logo" width={300} />
        </Link>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-6 pt-16 pb-40">
          <h1 className="text-3xl font-bold text-gray-800">
            Please Enter Your Information
          </h1>

          <p className="text-gray-600 flex items-center gap-2">
            Checking your rate won't affect your credit score.
          </p>

          {error && <div className="text-red-500 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Legal First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>

            {/* Last Name and SSN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Legal Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="ssn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Social Security Number
                </label>
                <input
                  type="text"
                  id="ssn"
                  placeholder="Enter your SSN (123-45-6789)"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                  value={formData.ssn}
                  onChange={(e) =>
                    setFormData({ ...formData, ssn: e.target.value })
                  }
                  required
                  pattern="\d{3}-?\d{2}-?\d{4}"
                  maxLength={11}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="text-sky-700 hover:text-sky-700 font-medium"
              >
                ← Back
              </button>

              <Button
                type="submit"
                className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden bg-sky-700 text-md text-white font-bold px-6 py-3 rounded-lg transition w-fit active:translate-y-0 active:shadow-none"
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
