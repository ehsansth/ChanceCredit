'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const [purchaseData, setPurchaseData] = useState({
    itemUrl: '',
    itemCost: '',
  });
  const [name, setName] = useState('John Doe'); // Mock name
  const [ssn, setSsn] = useState('123-45-6789'); // Mock SSN

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Fetch the user's credit score
      const scoreResponse = await fetch('http://localhost:5001/calc_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, ssn }),
      });

      if (!scoreResponse.ok) {
        throw new Error('Failed to fetch credit score.');
      }

      const { user } = await scoreResponse.json();

      // Redirect to the final page with query parameters
      router.push(
        `/final?name=${encodeURIComponent(name)}&creditScore=${user.score}&loanAmount=${purchaseData.itemCost}`
      );
    } catch (error) {
      alert('Failed to process your request. Please try again.');
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPurchaseData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPurchaseData((prev) => ({ ...prev, itemCost: value }));
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Tell us about your purchase</h1>

          <div>
            <label htmlFor="itemUrl" className="block text-sm font-medium text-gray-700">Item URL</label>
            <input
              id="itemUrl"
              type="url"
              placeholder="https://example.com/product"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={purchaseData.itemUrl}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="itemCost" className="block text-sm font-medium text-gray-700">Item Cost</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="itemCost"
                type="text"
                placeholder="0.00"
                className="w-full pl-7 p-3 border border-gray-300 rounded-lg"
                value={purchaseData.itemCost}
                onChange={handleCostInput}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}

