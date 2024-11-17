'use client';

import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import logo from '../images/fullLogo.png';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";

// Define a type for the repayment plans
type RepaymentPlan = {
  totalWeeks: number;
  weeklyPayment: number;
  firstQuarterPayment: number;
};

export default function FinalPage() {
  const searchParams = useSearchParams();

  // Retrieve `id` and `loanAmount` from query parameters
  const id = searchParams.get('userId');
  const loanAmount = Number(searchParams.get('loanAmount') || 0);

  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<string>('');
  const [plans, setPlans] = useState<RepaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          setError('Invalid user ID. Please try again.');
          return;
        }

        // Make a POST request to fetch user data using the `id` and `loanAmount`
        const response = await axios.post('http://127.0.0.1:5001/calc_score', { id, item_price: loanAmount });
        console.log('Requesting user data with ID:', id);

        const { user, payment_options, interest_rate } = response.data;

        // Update state with fetched user data
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
        console.error('Error fetching user data:', err);
        setError(
          err.response?.data?.message || 'Failed to fetch user data. Please try again later.'
        );
      }
    };

    fetchUserData();
  }, [id, loanAmount]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPlan !== null) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen font-sans bg-sky-50">
      <nav className="flex items-center justify-between px-12 py-4 bg-white drop-shadow-md fixed top-0 right-0 left-0 z-50">
        <Link href="/">
          <Image
            src={logo}
            alt="ChanceCredit Logo"
            width={300}
          />
        </Link>
        <div className="flex items-center gap-8"></div>
      </nav>
      <main className="pt-40 pb-20 px-4 max-w-4xl mx-auto">
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
              Congratulations!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your credit score is <span className="font-bold text-sky-700">{creditScore}</span>.
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
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedPlan === index
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-gray-200 hover:border-sky-600'
                        }`}
                      onClick={() => setSelectedPlan(index)}
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.totalWeeks} Weeks</h3>
                      <p className="text-2xl font-bold text-sky-700">
                        ${plan.weeklyPayment.toFixed(2)}{' '}
                        <span className="text-sm font-normal text-gray-600">/week</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        First Quarter Payment: ${plan.firstQuarterPayment.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={selectedPlan === null}
                  className={`w-full mt-6 px-8 py-3 rounded-lg font-semibold transition-colors ${selectedPlan !== null
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Continue with {selectedPlan !== null ? `${plans[selectedPlan].totalWeeks}-Week` : ''} Plan
                </Button>
              </div>
            </form>
          </>
        )}
      </main>
      <footer className='flex items-center justify-center py-4 bg-sky-50 border-t border-gray-400 mx-64'>
        <p>
          By Ehsan Ahmed, Anthony Dang, Van Thiang, and Vincent Dang @ HackUTD 2024: Ripple Effect
        </p>
      </footer>
    </div>
  );
}
