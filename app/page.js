import Link from "next/link";
import PostsExplorer from "@/components/PostsExplorer";
import { getAllTopics, getPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getPosts();
  const topicList = getAllTopics();
  const topics = ["All", ...topicList];
  const featured = posts[2];

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" href="/">
            NutriNotes
          </Link>
          <nav id="site-nav" className="site-nav">
            <a href="#latest">Latest</a>
            <a href="#topics">Topics</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">Evidence-Based Wellness</p>
              <h1>Your Personal Nutrition Blog, Built to Teach and Inspire</h1>
              <p className="hero-copy">
                I translate nutrition science into practical habits you can actually use. Explore articles on
                healthy eating, weight management, and lifestyle medicine.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#latest">
                  Read Latest Posts
                </a>
                <a className="btn btn-secondary" href="#about">
                  Meet the Author
                </a>
              </div>
            </div>
            <aside className="hero-highlight">
              <p className="label">Featured Topic</p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link href={`/posts/${featured.slug}`}>Open article</Link>
            </aside>
          </div>
        </section>

        <section id="topics" className="topics-section">
          <div className="container">
            <h2 className="section-title">Browse By Topic</h2>
            <div className="topic-filters" aria-label="Topic list">
              {topicList.map((topic) => (
                <span key={topic} className="filter-btn topic-pill">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="latest" className="posts-section">
          <div className="container">
            <h2 className="section-title">Latest Posts</h2>
            <PostsExplorer posts={posts} topics={topics} />
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="container about-grid">
            <div>
              <h2 className="section-title">About Me</h2>
              <p>
                I&apos;m a registered dietitian sharing practical nutrition guidance grounded in current research.
                This blog is where I publish evidence summaries, myth checks, and simple food strategies.
              </p>
              <p>
                Replace this section with your own bio, credentials, and social links to personalize the site.
              </p>
            </div>
            <div className="about-card">
              <h3>Popular Categories</h3>
              <ul>
                <li>Weight Management</li>
                <li>Sports Nutrition</li>
                <li>Supplements</li>
                <li>Meal Planning</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="newsletter-section">
          <div className="container newsletter-wrap">
            <h2>Get New Articles by Email</h2>
            <p>Keep this as a newsletter signup placeholder or connect it to your preferred email tool.</p>
            <form className="newsletter-form" action="#" method="post">
              <input type="email" placeholder="you@example.com" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <p>
            © {new Date().getFullYear()} NutriNotes. All rights reserved.
          </p>
          <p>Built for your personal publishing workflow.</p>
        </div>
      </footer>
    </>
  );
}
