import Link from "next/link";
import { notFound } from "next/navigation";
import PostTranslator from "@/components/PostTranslator";
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

        <PostTranslator post={post} />
      </div>
    </main>
  );
}
