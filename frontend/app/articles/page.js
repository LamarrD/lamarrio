// This is /blog

import Link from "next/link";
import { createClient } from "contentful";

export const metadata = {
  title: "Blog",
  description: "A collection of blog posts",
};

const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});

const getBlogEntries = async () => {
  const entries = await client.getEntries({ content_type: "blog" });
  const sortedEntries = entries.items.sort((a, b) => new Date(b.fields.date) - new Date(a.fields.date));
  return sortedEntries;
};

export default async function Home() {
  const blogEntries = await getBlogEntries();
  return (
    <main className="px-6 flex justify-center">
      <div className="max-w-2xl">
        <h1 className="font-extrabold text-3xl mb-2">Posts</h1>
        {blogEntries.map((singlePost) => {
          const { slug, title, date, content } = singlePost.fields;
          const timeToRead = Math.floor(content?.length / 600) || 1;
          return (
            <div key={slug} className="mb-8">
              <Link href={`/articles/${slug}`}>
                <h2 className="text-2xl font-bold hover:underline">{title}</h2>
              </Link>
              <p className="text-gray-600 text-sm">
                {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} •{" "}
                {timeToRead} min read
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
