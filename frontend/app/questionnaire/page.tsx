'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import axios from 'axios'; // Import Axios
import logo from '../images/fullLogo.png';

export default function QuestionnairePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssn: '',
    itemPrice: 1000, // Default item price
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading to true during the submission

    // Validate SSN format
    const ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;
    if (!ssnPattern.test(formData.ssn)) {
      setError('Please enter a valid Social Security Number.');
      setLoading(false);
      return;
    }

    try {
      // Prepare the data to send to the backend
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        ssn: formData.ssn,
        item_price: formData.itemPrice,
      };

      // Send POST request to the Flask backend
      const response = await axios.post('http://127.0.0.1:5001/calc_score', payload);
      console.log('Response from backend:', response.data);

      // Navigate to results page with data (e.g., user ID or score)
      const { user, interest_rate, payment_options } = response.data;
      router.push(`/results?userId=${user.id}&score=${user.score}&interestRate=${interest_rate}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to submit the form. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
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

            {/* Item Price */}
            <div>
              <label
                htmlFor="itemPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Item Price
              </label>
              <input
                type="number"
                id="itemPrice"
                placeholder="Enter the item price"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
                value={formData.itemPrice}
                onChange={(e) =>
                  setFormData({ ...formData, itemPrice: Number(e.target.value) })
                }
                required
              />
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
                disabled={loading}
                className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden bg-sky-700 text-md text-white font-bold px-6 py-3 rounded-lg transition w-fit"
              >
                {loading ? 'Submitting...' : 'Next'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
