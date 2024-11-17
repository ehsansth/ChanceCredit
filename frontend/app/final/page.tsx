'use client';

import { useSearchParams } from 'next/navigation';

export default function FinalPage() {
  const searchParams = useSearchParams();
  const plans = JSON.parse(searchParams.get('plans') || '[]');

  return (
    <div className="min-h-screen font-sans">
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Your Repayment Plans</h1>

        {plans.length > 0 ? (
          <div className="mt-8 space-y-4">
            {plans.map((plan: { term: number; totalCost: string; emi: string }, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-lg font-bold">Term: {plan.term} weeks</p>
                <p>Total Cost: ${plan.totalCost}</p>
                <p>Weekly Payment: ${plan.emi}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500 text-center">Error: No plans found</p>
        )}
      </main>
    </div>
  );
}
