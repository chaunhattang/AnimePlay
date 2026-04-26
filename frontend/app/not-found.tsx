import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-8 text-center">
      <h1 className="text-2xl font-bold">Movie Not Found</h1>
      <p className="text-sm text-gray-400">The page you requested is not available.</p>
      <Link href="/movies" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
        Back to Browse
      </Link>
    </div>
  );
}
