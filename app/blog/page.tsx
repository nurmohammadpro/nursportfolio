import Link from 'next/link';

export const metadata = {
  title: "Blog | Nur Mohammad - Web Application Developer",
  description: "Insights on Javascript, React, Next.js, and Web Automation from a professional developer.",
};

export default function BlogPage() {
  // Placeholder data for your current state
  const posts = [
    {
      id: 1,
      title: "Building Real-time Dashboards with Next.js and Firebase",
      excerpt: "How to leverage Firestore onSnapshot for instant UI updates in professional SaaS apps.",
      date: "2026-02-04",
      slug: "nextjs-firebase-realtime"
    }
  ];

  return (
    <div className="min-h-screen bg-(--primary) text-(--text-main) p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="p-heading-xl mb-4">The Dev Journal</h1>
          <p className="p-body text-(--text-subtle) max-w-lg italic">
            Documenting my journey building for AREI Group and sharing technical insights on modern web stacks.
          </p>
        </header>

        <div className="grid gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group border-b border-(--border-color) pb-12">
              <span className="p-engine-sm uppercase font-black opacity-40 mb-2 block tracking-widest">
                {post.date}
              </span>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-4 group-hover:text-(--brand) transition-colors cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              <p className="p-body text-(--text-subtle) mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              <Link href={`/blog/${post.slug}`} className="p-engine-sm uppercase font-black border-b-2 border-(--brand) pb-1">
                Read Transmission
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}