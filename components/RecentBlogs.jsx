"use client";

import React from "react";
import Link from "next/link";

export default function RecentBlogs({ blogs = [], loading = false }) {
  return (
    <div className="space-y-8">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        blogs.map((blog) => (
          <Link
            href={`/blog/${blog.id}`}
            key={blog.id}
            className="group block border-b border-slate-200/50 pb-6 last:border-0 last:pb-0"
          >
            <h4 className="font-bold text-lg text-slate-800 leading-snug group-hover:text-brand-600 transition-colors mb-2">
              {blog.title}
            </h4>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>{blog.author}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />

              <span>
                {new Date(blog.published_at || blog.created_at).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" }
                )}
              </span>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-slate-400 italic">
          No recent blogs available.
        </p>
      )}
    </div>
  );
}