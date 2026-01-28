'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users, Filter } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { API_URL } from '@/lib/api-config';

export default function MemberEventsCalendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, general, my-groups

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [events, filterType]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/engagements/events/get_member_events.php?member_id=${user?.id}`);
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filterType === 'all') {
      setFilteredEvents(events);
    } else if (filterType === 'general') {
      setFilteredEvents(events.filter(e => e.target_audience === 'everyone'));
    } else if (filterType === 'my-groups') {
      setFilteredEvents(events.filter(e => e.is_group_event));
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDay = (date) => {
    if (!date) return [];
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <CalendarIcon className="text-orange-600" size={32} />
            My Events Calendar
          </h1>
          <p className="text-gray-500 mt-1">View general church events and events for your groups</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterType === 'all' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterType('general')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterType === 'general' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setFilterType('my-groups')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filterType === 'my-groups' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Groups
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-500 uppercase py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((date, index) => {
              const dayEvents = date ? getEventsForDay(date) : [];
              const isToday = date && 
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 rounded-xl border transition-all ${
                    !date 
                      ? 'bg-gray-50 border-transparent' 
                      : isToday
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-gray-100 hover:border-orange-200'
                  }`}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-bold mb-1 ${
                        isToday ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`w-full text-left px-2 py-1 rounded-lg text-xs font-bold truncate transition-all ${
                              event.is_group_event
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {event.title}
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-gray-500 font-bold px-2">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4">
          {selectedEvent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              {selectedEvent.image_url && (
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-40 object-cover rounded-2xl mb-4"
                />
              )}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                {selectedEvent.is_group_event && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                    {selectedEvent.group_name}
                  </span>
                )}
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-orange-600" />
                  <span className="text-sm font-medium">
                    {new Date(selectedEvent.start_time).toLocaleString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-orange-600" />
                  <span className="text-sm font-medium">{selectedEvent.location}</span>
                </div>
                {selectedEvent.target_audience && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-orange-600" />
                    <span className="text-sm font-medium capitalize">{selectedEvent.target_audience}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4">{selectedEvent.description}</p>
              <button
                onClick={() => window.location.href = `/events/register?id=${selectedEvent.id}`}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors"
              >
                Register for Event
              </button>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
              <CalendarIcon className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">Select an event to view details</p>
            </div>
          )}

          {/* Upcoming Events List */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEvents
                .filter(e => new Date(e.start_time) >= new Date())
                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                .slice(0, 10)
                .map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-bold text-gray-900 text-sm">{event.title}</p>
                      {event.is_group_event && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                          Group
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(event.start_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
