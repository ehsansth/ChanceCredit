import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <nav className="flex items-center justify-between px-12 py-4 bg-white border-b border-lightgrey fixed top-0 right-0 left-0 z-50">
        <Link href="/">
          <div className="text-3xl font-semibold">ChanceCredit</div>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/login" className="px-4 py-2 text-xl text-teal-600 hover:text-teal-700 font-bold">
            LOG IN
          </Link>
        </div>
      </nav>

      <main className="relative bg-[#f5fbfb] px-8 py-16 md:py-24 mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
              This is Your <span className="font-bold">Chance</span>
            </h1>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>Something something</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>Something something</span>
              </div>
            </div>

            <button className="bg-teal-600 text-3xl text-white font-bold px-8 py-4 rounded-md hover:bg-teal-700 transition w-fit">
              Check your rate
            </button>

            {/* 
            <p className="text-sm text-gray-600">
              <span className="inline-block mr-2">🔒</span>
              Won't affect your credit score<sup>1</sup>
            </p> 
            */}

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">What would you like to do?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Personal loans</h3>
                  <p className="text-gray-600">Consolidate debt and more</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Car loan refinance</h3>
                  <p className="text-gray-600">Swap your car loan and save</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <Image
              src="/hero-image.jpg"
              alt="Man using phone"
              width={600}
              height={800}
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}