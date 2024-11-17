'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = searchParams.get('score'); // Get 'score' from query parameters

  const handleBackToHome = () => {
    router.push('/'); // Redirect to home page
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Credit Score</h1>
      {score ? (
        <div className="text-6xl font-extrabold text-teal-600 mb-8">{score}</div>
      ) : (
        <div className="text-red-500">Error: No score found</div>
      )}
      <button
        onClick={handleBackToHome}
        className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
      >
        Back to Home
      </button>
    </div>
  );
}
