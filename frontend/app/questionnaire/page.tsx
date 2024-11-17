'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionnairePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    ssn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Combine first and last name
    const fullName = `${formData.firstName} ${formData.lastName}`;

    try {
      const response = await fetch('http://localhost:5001/calc_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          ssn: formData.ssn,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Response from backend:', data);

      // Navigate to results page and optionally pass the score
      router.push('/results');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen font-sans">
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

      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-800">
            What's your legal name?
          </h1>
          <p className="text-gray-600">
            Checking your rate won't affect your credit score.
          </p>
          
          {error && (
            <div className="text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
            <div>
              <input
                type="text"
                placeholder="Legal first name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Legal last name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Social Security Number (e.g., 123-45-6789)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.ssn}
                onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                required
                pattern="\d{3}-?\d{2}-?\d{4}"
                maxLength={11}
              />
            </div>
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
                className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
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
