import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Post Not Found | NutriNotes" };
  }

  return {
    title: `${post.title} | NutriNotes`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="post-page">
      <div className="container post-container">
        <Link className="back-link" href="/">
          ← Back to all posts
        </Link>

        <article className="post-article">
          <p className="eyebrow">{post.topic}</p>
          <h1>{post.title}</h1>
          <div className="post-meta-row">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readTime} read</span>
          </div>

          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </div>
    </main>
  );
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}
