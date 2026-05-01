"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import axios from "axios";

const API_URL = "https://content.lifereachchurch.org";

export default function EventsSidebar({ limit = 3 }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/engagements/events/list.php`);
        const allEvents = res.data.rows || [];

        // ✅ Same logic as your EventsPage
        const publicEvents = allEvents.filter(e => e.ministry_id === null);

        const now = new Date();

        const upcoming = publicEvents
          .filter(e => new Date(e.start_time) >= now)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        // ✅ Format for sidebar
        const formatted = upcoming.slice(0, limit).map(event => ({
          id: event.id,
          title: event.title,
          time: new Date(event.start_time).toLocaleString(undefined, {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit"
          }),
          location: event.location || "TBA"
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Sidebar events error:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  return (
    <div className="relative space-y-8">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-slate-700/40 rounded-2xl" />
          ))}
        </div>
      ) : events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className="flex gap-4 group cursor-pointer">
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-brand-600 rounded-2xl group-hover:bg-white group-hover:text-brand-600 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-bold text-lg mb-1">{event.title}</h4>

              <div className="flex flex-col text-sm text-slate-400 space-y-1">
                <span className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-brand-400" />
                  {event.time}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-brand-400" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400 italic">
          No upcoming events available.
        </p>
      )}
    </div>
  );
}