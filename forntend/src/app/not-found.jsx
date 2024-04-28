import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center bg-gray-300 m-4">
      <div className="text-center m-4">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl font-semibold text-gray-600 mt-4">Oops! Page not found.</p>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>

        <Link href="/" >
            <h2 className="inline-block px-6 py-3 mt-6 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Back to Home
            </h2>
        </Link>
      </div>
    </div>
  )
}
