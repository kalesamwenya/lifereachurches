"use client";

import React, { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const fallbackEpisodes = [
  {
    id: "fallback",
    title: "Unable to load podcasts",
    duration: "00:00",
  },
];

export default function PodcastSidebar({ limit = 4 }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch("/api/podcast-rss");
        const data = await res.json();

        if (!data.success) throw new Error("Failed");

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.xml, "text/xml");

        const items = xml.querySelectorAll("item");

        const parsed = Array.from(items).map((item, index) => {
          const title =
            item.querySelector("title")?.textContent ||
            `Episode ${index + 1}`;

          // 🔥 IMPORTANT: USE GUID (matches podcast page)
          const guid = item.querySelector("guid")?.textContent;

          const durationTag =
            item.getElementsByTagName("itunes:duration")[0];

          let duration = "00:00";
          if (durationTag) {
            const val = durationTag.textContent;
            duration = val.includes(":") ? val : "00:00";
          }

          return {
            id: guid || `episode-${index}`, // ✅ MATCHES PODCAST PAGE
            title,
            duration,
          };
        });

        setEpisodes(parsed.slice(0, limit));
      } catch (err) {
        console.error("Podcast sidebar error:", err);
        setEpisodes(fallbackEpisodes);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [limit]);

  // 🔥 ROUTE TO PODCAST PAGE WITH EP ID
  const handlePlay = (episode) => {
    if (!episode.id) return;

    const encodedId = encodeURIComponent(episode.id);
    router.push(`/podcast?ep=${encodedId}`);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        episodes.map((podcast) => (
          <div
            key={podcast.id}
            onClick={() => handlePlay(podcast)}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <div className="bg-slate-900 text-white p-3 rounded-xl group-hover:bg-brand-600 transition-colors">
              <PlayCircle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                {podcast.title}
              </h4>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                {podcast.duration}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}