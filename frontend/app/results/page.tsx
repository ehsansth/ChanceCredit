'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const [purchaseData, setPurchaseData] = useState({
    itemUrl: '',
    itemCost: '',
  });
  const [ssn, setSsn] = useState(''); // Assume SSN is passed from the previous page.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Fetch the credit score using the user's SSN
      const scoreResponse = await fetch('http://localhost:5001/get_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ssn }),
      });

      if (!scoreResponse.ok) {
        throw new Error('Failed to fetch credit score.');
      }

      const { score } = await scoreResponse.json();

      // Calculate repayment plans based on item cost and credit score
      const itemCost = parseFloat(purchaseData.itemCost);
      const repaymentPlans = calculateRepaymentPlans(itemCost, score);

      // Pass repayment plans to the final page
      router.push(`/final?plans=${encodeURIComponent(JSON.stringify(repaymentPlans))}`);
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
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal
    setPurchaseData((prev) => ({ ...prev, itemCost: value }));
  };

  return (
    <div className="min-h-screen font-sans">
      <nav className="flex items-center justify-between px-12 py-4 bg-white border-b border-lightgrey fixed top-0 right-0 left-0 z-50">
        <a href="/" className="text-2xl font-bold text-teal-600">Upstart</a>
        <a href="/login" className="px-4 py-2 text-xl text-teal-600 hover:text-teal-700 font-bold">LOG IN</a>
      </nav>

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
            <p className="text-sm text-gray-500">Paste the link to the item you want to purchase (optional).</p>
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
                className="w-full pl-7 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={purchaseData.itemCost}
                onChange={handleCostInput}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// Helper function to calculate repayment plans
function calculateRepaymentPlans(itemCost: number, score: number) {
  const interestRate = score >= 750 ? 0.05 : score >= 650 ? 0.1 : 0.15;
  return [
    { term: 4, totalCost: (itemCost * (1 + interestRate)).toFixed(2), emi: (itemCost * (1 + interestRate) / 4).toFixed(2) },
    { term: 8, totalCost: (itemCost * (1 + interestRate)).toFixed(2), emi: (itemCost * (1 + interestRate) / 8).toFixed(2) },
    { term: 12, totalCost: (itemCost * (1 + interestRate)).toFixed(2), emi: (itemCost * (1 + interestRate) / 12).toFixed(2) },
  ];
}
