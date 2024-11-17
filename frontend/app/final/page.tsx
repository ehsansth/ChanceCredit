'use client';

import axios from 'axios';
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
  const ssn = searchParams.get('ssn') || 'X-X-XXXX';
  const loanAmount = Number(searchParams.get('loanAmount') || 0);

  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<string>('');
  const [plans, setPlans] = useState<RepaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user data already exists
        const response = await axios.get('http://localhost:5001/get_user', {
          params: { name, ssn },
        });

        if (response.status === 200) {
          // If data exists, use it
          const { user } = response.data;
          setCreditScore(user.score);
          setError(null);
        } else {
          // If no data, calculate score
          await calculateScore();
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          // If user not found, calculate score
          await calculateScore();
        } else {
          console.error(err);
          setError('Failed to fetch user data. Please try again later.');
        }
      }
    };

    const calculateScore = async () => {
      try {
        const response = await axios.post('http://localhost:5001/calc_score', {
          name,
          ssn,
          item_price: loanAmount,
        });

        const { user, payment_options, interest_rate } = response.data;

        setCreditScore(user.score);
        setInterestRate(interest_rate);

        // Extract repayment plans
        const newPlans: RepaymentPlan[] = [
          payment_options['4_week_plan'],
          payment_options['8_week_plan'],
          payment_options['12_week_plan'],
        ].map((plan) => ({
          totalWeeks: plan.total_weeks,
          weeklyPayment: plan.weekly_payment,
          firstQuarterPayment: plan.first_quarter_payment,
        }));

        setPlans(newPlans);
        setError(null); // Reset error on success
      } catch (err: any) {
        console.error(err);
        setError('Failed to calculate credit score. Please try again later.');
      }
    };

    fetchUserData();
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
        {creditScore === null && !error ? (
          <div className="text-center">
            <p className="text-xl text-gray-600">Fetching your credit score...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p className="text-xl">{error}</p>
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
                        ${plan.weeklyPayment.toFixed(2)}{' '}
                        <span className="text-sm font-normal text-gray-600">/week</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        First Quarter Payment: ${plan.firstQuarterPayment.toFixed(2)}
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
