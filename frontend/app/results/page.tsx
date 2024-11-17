'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import logo from '../images/fullLogo.png';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve userId and score from query parameters
  const userId = searchParams.get('userId');
  const score = searchParams.get('score');
  const interestRate = searchParams.get('interestRate'); // Optional for display

  const [purchaseData, setPurchaseData] = useState({
    itemUrl: '',
    itemCost: '',
  });

  // Redirect to the final page with loan amount and userId
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate item cost
    if (!purchaseData.itemCost || isNaN(Number(purchaseData.itemCost))) {
      alert('Please enter a valid item cost.');
      return;
    }

    try {
      // Redirect to the final page with query parameters
      router.push(
        `/final?userId=${encodeURIComponent(userId)}&loanAmount=${encodeURIComponent(
          purchaseData.itemCost
        )}`
      );
    } catch (error) {
      console.error('Failed to process your request:', error);
      alert('Failed to process your request. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPurchaseData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and a single decimal
    setPurchaseData((prev) => ({ ...prev, itemCost: value }));
  };

  return (
    <div className="bg-sky-50 min-h-screen font-sans">
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
      <main className="pt-40 px-4 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Enter Your Desired Purchase</h1>
          <p className="text-center text-gray-600">
            Your credit score is <span className="font-bold">{score}</span> and interest rate is <span className="font-bold">{interestRate}</span>.
          </p>

          <div>
            <label htmlFor="itemUrl" className="block text-sm font-medium text-gray-700">
              Item URL
            </label>
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
            <label htmlFor="itemCost" className="block text-sm font-medium text-gray-700">
              Item Cost
            </label>
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
          <div className="flex justify-center">
            <Button
              type="submit"
              className="transition-transform transform hover:-translate-y-1 hover:shadow-[0_3px_5px_-2px_rgba(0,0,0,1)] overflow-hidden bg-sky-700 text-md text-white font-bold px-6 py-3 rounded-lg transition w-fit active:translate-y-0 active:shadow-none"
            >
              Submit
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
