'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FinalPage() {
  const searchParams = useSearchParams();

  // Retrieve data from query parameters
  const name = searchParams.get('name') || 'User';
  const creditScore = Number(searchParams.get('creditScore') || 0);
  const loanAmount = Number(searchParams.get('loanAmount') || 0);

  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const calculatePayments = (weeks: number) => {
    const interestRates: Record<number, number> = {
      4: 0.05, // 5% for 4 weeks
      8: 0.08, // 8% for 8 weeks
      12: 0.1, // 10% for 12 weeks
    };

    const totalAmount = loanAmount * (1 + interestRates[weeks]);
    const weeklyPayment = totalAmount / weeks;

    return {
      weeklyAmount: weeklyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      interestRate: (interestRates[weeks] * 100).toFixed(1),
    };
  };

  const plans = [
    { weeks: 4, ...calculatePayments(4) },
    { weeks: 8, ...calculatePayments(8) },
    { weeks: 12, ...calculatePayments(12) },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPlan !== null) {
      console.log('Selected plan:', plans[selectedPlan]);
      alert(`You selected the ${plans[selectedPlan].weeks}-week plan!`);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Congratulations, {name}!
          </h1>
          <p className="text-xl text-gray-600">
            Your credit score is <span className="font-bold text-teal-600">{creditScore}</span>.
          </p>
          <p className="text-lg text-gray-600 mt-2">
            You've been approved for a loan of ${loanAmount}!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Choose Your Repayment Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlan === index
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-400'
                  }`}
                  onClick={() => setSelectedPlan(index)}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.weeks} Weeks</h3>
                  <p className="text-2xl font-bold text-teal-600">
                    ${plan.weeklyAmount} <span className="text-sm font-normal text-gray-600">/week</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ${plan.totalAmount} | Interest Rate: {plan.interestRate}%
                  </p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={selectedPlan === null}
              className={`w-full mt-6 px-8 py-3 rounded-lg font-semibold transition-colors ${
                selectedPlan !== null
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue with {selectedPlan !== null ? `${plans[selectedPlan].weeks}-Week` : ''} Plan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
