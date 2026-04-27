import Link from "next/link";
import { Film, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="animate-fade-in-up flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-brand-600/10" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600/20">
            <Film className="h-10 w-10 text-brand-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white">404</h1>
          <p className="text-xl font-semibold text-gray-300">Page Not Found</p>
          <p className="text-sm text-gray-500">The page you requested does not exist or has been moved.</p>
        </div>

        <Link href="/movies" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>
    </div>
  );
}
