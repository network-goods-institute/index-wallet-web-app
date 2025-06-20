'use client';

export default function GlobalError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
            <p className="mb-6 text-gray-600">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <button
              onClick={() => reset()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}