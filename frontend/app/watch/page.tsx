"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getMediaUrl } from "@/lib/api-client";

export default function WatchPage() {
  const params = useSearchParams();
  const videoUrlParam = params?.get("videoUrl") ?? "";
  const animeId = params?.get("animeId") ?? "";
  const episodeId = params?.get("episodeId") ?? "";

  function getYouTubeEmbedUrl(url?: string | null) {
    if (!url) return null;
    try {
      const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}`;
    } catch (e) {
      // ignore
    }
    return null;
  }

  const youtubeEmbed = getYouTubeEmbedUrl(videoUrlParam);
  const resolvedSrc = videoUrlParam && !videoUrlParam.startsWith("http") ? getMediaUrl(videoUrlParam) : videoUrlParam;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        {youtubeEmbed ? (
          <iframe className="w-full h-full" src={youtubeEmbed} title={`Video player ${episodeId}`} frameBorder={0} allowFullScreen />
        ) : (
          <video controls className="w-full h-full">
            <source src={resolvedSrc} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link href={`/movies/${animeId}`} className="text-sm text-gray-300 hover:underline">
          Back to movie
        </Link>

        <a href={videoUrlParam ? (videoUrlParam.startsWith("http") ? videoUrlParam : getMediaUrl(videoUrlParam)) : "#"} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:underline">
          Open original
        </a>
      </div>
    </div>
  );
}
