"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  User,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button, SectionTitle, Card } from "../../../components/UIComponents";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { API_BASE_URL } from "@/lib/config"; // Ensure your base URL config is correctly imported

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSermon, setActiveSermon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("All Series");

  // Fetch data from PHP backend
  useEffect(() => {
    async function fetchSermons() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/sermons/list.php`); // Adjust path to match your layout
        
        if (!res.ok) {
          throw new Error("Failed to fetch sermon directory data");
        }
        
        const data = await res.json();
        setSermons(data);
      } catch (err) {
        console.error("Error loading sermons:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSermons();
  }, []);

  function openPlayer(sermon) {
    // Normalizing DB properties to feed into the VideoPlayerModal payload structure safely
    const normalizedSermon = {
      ...sermon,
      url: sermon.video_url, // fallback mapping if player expects sermon.url
      title: sermon.title,
    };
    setActiveSermon(normalizedSermon);
    setIsOpen(true);
  }

  // Extract list of unique active series titles for the drop-down selector
  const availableSeries = [
    "All Series",
    ...new Set(
      sermons
        .map((s) => s.series_name)
        .filter((name) => name && name.trim() !== "")
    ),
  ];

  // Live client-side processing computation
  const filteredSermons = sermons.filter((sermon) => {
    // 1. Status Filter: Only show published items to general site visitors
    if (sermon.status !== "published") return false;

    // 2. Dropdown series selector filter
    const matchesSeries =
      selectedSeries === "All Series" || sermon.series_name === selectedSeries;

    // 3. Main string search query text matching
    const matchesSearch =
      searchQuery.trim() === "" ||
      sermon.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.series_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeries && matchesSearch;
  });

  return (
    <div className="py-24 bg-gray-50 pt-32 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Sermon Archive" subtitle="Watch & Listen" />

        {/* CONTROLS & FILTERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-16 flex flex-col md:flex-row gap-4 border border-gray-100">
          <input
            type="text"
            placeholder="Search by title, series, or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 text-gray-800"
          />

          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="px-6 py-4 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[200px]"
          >
            {availableSeries.map((series, idx) => (
              <option key={idx} value={series}>
                {series}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING & STATE RENDERING FLAGS */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-orange-600" size={40} />
            <p className="text-sm text-gray-500 font-medium">Loading archive updates...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-xl mx-auto">
            <p className="text-red-700 font-bold mb-2">Unable to load archive database data</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        )}

        {/* EMPTY ARCHIVE STATUS */}
        {!loading && !error && filteredSermons.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto p-8">
            <p className="text-gray-400 font-bold mb-1">No matching sermons found</p>
            <p className="text-sm text-gray-400">
              Try modifying your search criteria or choosing a different series filter.
            </p>
          </div>
        )}

        {/* SERMON ARCHIVE GRID GRID */}
        {!loading && !error && filteredSermons.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSermons.map((sermon) => (
              <Card key={sermon.id} className="group flex flex-col justify-between h-full">
                <div>
                  <div
                    className="relative aspect-video overflow-hidden cursor-pointer bg-gray-900"
                    onClick={() => openPlayer(sermon)}
                  >
                    {sermon.image ? (
                      <img
                        src={sermon.image}
                        alt={sermon.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center" />
                    )}

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center pl-1 shadow-md">
                        <Play size={28} className="text-orange-600" fill="currentColor" />
                      </div>
                    </div>

                    {sermon.series_name && (
                      <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {sermon.series_name}
                      </div>
                    )}
                  </div>

                  <div className="p-8 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4 flex items-center flex-wrap gap-2">
                      <span className="flex items-center gap-1 font-medium">
                        <User size={14} className="text-gray-400" /> {sermon.preacher}
                      </span>
                      {sermon.sermon_date && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:inline"></span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Calendar size={14} /> {new Date(sermon.sermon_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0 mt-auto">
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="flex-1 text-xs font-bold uppercase tracking-wider"
                      onClick={() => openPlayer(sermon)}
                    >
                      Watch
                    </Button>

                    <Button
                      variant="outline"
                      className="text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all"
                      onClick={() => openPlayer(sermon)}
                    >
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PLAYER MODAL LAYER */}
      {isOpen && activeSermon && (
        <VideoPlayerModal
          sermon={activeSermon}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}