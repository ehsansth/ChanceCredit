'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Define a type for the repayment plans
type RepaymentPlan = {
  totalWeeks: number;
  weeklyPayment: number;
  firstQuarterPayment: number;
};

export default function FinalPage() {
  const searchParams = useSearchParams();

  // Retrieve data from query parameters
  const name = searchParams.get('name') || 'User';
  const ssn = searchParams.get('ssn') || 'Unknown';
  const loanAmount = Number(searchParams.get('loanAmount') || 0);

  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<string>('');
  const [plans, setPlans] = useState<RepaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the credit score and repayment plans from the backend
    const fetchCreditScore = async () => {
      try {
        const response = await fetch('http://localhost:5001/calc_score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, ssn, item_price: loanAmount }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch credit score.');
        }

        const { user, payment_options, interest_rate } = await response.json();
        setCreditScore(user.score);
        setInterestRate(interest_rate);

        // Extract repayment plans from the backend response
        const newPlans = [
          {
            totalWeeks: payment_options['4_week_plan'].total_weeks,
            weeklyPayment: payment_options['4_week_plan'].weekly_payment,
            firstQuarterPayment: payment_options['4_week_plan'].first_quarter_payment,
          },
          {
            totalWeeks: payment_options['8_week_plan'].total_weeks,
            weeklyPayment: payment_options['8_week_plan'].weekly_payment,
            firstQuarterPayment: payment_options['8_week_plan'].first_quarter_payment,
          },
          {
            totalWeeks: payment_options['12_week_plan'].total_weeks,
            weeklyPayment: payment_options['12_week_plan'].weekly_payment,
            firstQuarterPayment: payment_options['12_week_plan'].first_quarter_payment,
          },
        ];
        setPlans(newPlans);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch credit score. Please try again.');
      }
    };

    fetchCreditScore();
  }, [name, ssn, loanAmount]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPlan !== null) {
      alert(`You selected the ${plans[selectedPlan].totalWeeks}-week plan!`);
      console.log('Selected plan:', plans[selectedPlan]);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {creditScore === null ? (
          <div className="text-center">
            <p className="text-xl text-gray-600">Fetching your credit score...</p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Congratulations, {name}!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your credit score is <span className="font-bold text-teal-600">{creditScore}</span>.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              You've been approved for a loan of ${loanAmount.toFixed(2)}!
            </p>
            <p className="text-lg text-gray-600 mb-6">Interest Rate: {interestRate}</p>

            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Repayment Plan</h2>

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
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.totalWeeks} Weeks</h3>
                      <p className="text-2xl font-bold text-teal-600">
                        ${plan.weeklyPayment.toFixed(2)} <span className="text-sm font-normal text-gray-600">/week</span>
                      </p>
                      <p className="text-sm text-gray-600">First Quarter Payment: ${plan.firstQuarterPayment.toFixed(2)}</p>
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
                  Continue with {selectedPlan !== null ? `${plans[selectedPlan].totalWeeks}-Week` : ''} Plan
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
