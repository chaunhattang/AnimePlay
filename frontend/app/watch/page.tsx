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
      if (m && m[1]) return `https://www.youtube.com/embed/${m[1]}?autoplay=1`;
    } catch (e) {}
    return null;
  }

  const youtubeEmbed = getYouTubeEmbedUrl(videoUrlParam);
  const isExternalEmbed = videoUrlParam.startsWith("http") && !youtubeEmbed;
  const resolvedSrc = videoUrlParam && !videoUrlParam.startsWith("http") ? getMediaUrl(videoUrlParam) : videoUrlParam;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="aspect-video rounded-lg overflow-hidden bg-black relative shadow-lg border border-white/10">
        {!videoUrlParam ? (
          <div className="flex h-full w-full items-center justify-center text-gray-500">Không tìm thấy link video</div>
        ) : youtubeEmbed ? (
          <iframe className="absolute inset-0 w-full h-full" referrerPolicy="strict-origin-when-cross-origin" src={youtubeEmbed} title={`Video player ${episodeId}`} frameBorder={0} allowFullScreen />
        ) : isExternalEmbed ? (
          <iframe className="absolute inset-0 w-full h-full" referrerPolicy="strict-origin-when-cross-origin" src={videoUrlParam} title={`Video player ${episodeId}`} frameBorder={0} allowFullScreen />
        ) : (
          <video controls autoPlay className="absolute inset-0 w-full h-full object-contain">
            <source src={resolvedSrc} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link href={`/movies/${animeId}`} className="inline-flex items-center gap-2 text-sm font-medium text-white-500 hover:text-brand-400 transition-colors">
          <span>&larr;</span> Quay lại trang phim
        </Link>
      </div>
    </div>
  );
}
