'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import Axios

export default function QuestionnairePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssn: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading to true during the submission

    const ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;
    if (!ssnPattern.test(formData.ssn)) {
      setError('Please enter a valid Social Security Number.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5001/calc_score', {
        name: `${formData.firstName} ${formData.lastName}`,
        ssn: formData.ssn,
        item_price: 1000, // Example item price
      });

      // Navigate to the results page with the score as a query parameter
      router.push(`/results?score=${response.data.user.score}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        err.response?.data?.message || 'Failed to submit the form. Please try again.'
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-12 py-4 bg-white border-b border-lightgrey fixed top-0 right-0 left-0 z-50">
        <a href="/" className="text-2xl font-bold text-teal-600">
          ChanceCredit
        </a>
        <a
          href="/login"
          className="px-4 py-2 text-xl text-teal-600 hover:text-teal-700 font-bold"
        >
          LOG IN
        </a>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-800">
            What's your legal name?
          </h1>

          <p className="text-gray-600 flex items-center gap-2">
            Checking your rate won't affect your credit score.
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </p>

          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}

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
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.ssn}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
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
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className={`px-8 py-3 font-semibold rounded-lg transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {loading ? 'Submitting...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
