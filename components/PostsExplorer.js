"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function PostsExplorer({ posts, topics }) {
  const [activeTopic, setActiveTopic] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const topicOk = activeTopic === "All" || post.topic === activeTopic;
      const term = searchTerm.trim().toLowerCase();
      const searchOk =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.topic.toLowerCase().includes(term);

      return topicOk && searchOk;
    });
  }, [posts, activeTopic, searchTerm]);

  return (
    <>
      <div className="topic-filters" aria-label="Topic filters">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className={`filter-btn ${topic === activeTopic ? "active" : ""}`}
            onClick={() => setActiveTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="section-head">
        <label className="search-wrap" htmlFor="search-input">
          <span className="sr-only">Search posts</span>
          <input
            id="search-input"
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </div>

      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="post-card">
            <div className="post-meta">
              <span>{post.topic}</span>
              <span>{post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="post-meta">
              <span>{formatDate(post.date)}</span>
              <Link href={`/posts/${post.slug}`}>Read more</Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="empty-state">No posts match your filter. Try another topic.</p>
      ) : null}
    </>
  );
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}
