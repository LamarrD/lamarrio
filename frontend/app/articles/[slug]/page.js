import { createClient } from "contentful";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "./CopyToClipboard";

const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});

export async function generateStaticParams() {
  const queryOptions = {
    content_type: "blog",
    select: "fields.slug",
  };
  const articles = await client.getEntries(queryOptions);
  return articles.items.map((article) => ({
    slug: article.fields.slug,
  }));
}

const fetchBlogPost = async (slug) => {
  const queryOptions = {
    content_type: "blog",
    "fields.slug[match]": slug,
  };
  const queryResult = await client.getEntries(queryOptions);
  return queryResult.items[0];
};

export default async function BlogPage(props) {
  const { params } = props;
  const { slug } = params;
  const article = await fetchBlogPost(slug);
  const timeToRead = Math.floor(article.fields.content.length / 600) || 1;
  const { title, author, date, content } = article.fields;

  return (
    <main className="px-4 lg:px-56 md:px-24 flex justify-center max-w-full">
      <div className="max-w-full w-full">
        <h1 className="font-extrabold text-3xl mb-2">{title}</h1>
        <div className="flex items-center space-x-3">
          <img className="w-10 h-10 rounded-full" src="/lamarr.jpeg" alt="Profile picture"></img>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">{author}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span>{timeToRead} min read</span>
              <span>•</span>
              <span>
                {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
        <hr className="my-8" />
        <div className="[&>p]:mb-8 [&>h2]:font-extrabold">
          <Markdown
            children={content}
            components={{
              code(props) {
                const { children, className, node, ref, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <div className="relative">
                    <SyntaxHighlighter
                      customStyle={{ marginTop: "-1.5rem", marginBottom: "2rem" }}
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, "")}
                      language={match[1]}
                      style={darcula}
                      wrapLongLines={true}
                      showLineNumbers={true}
                    />
                    <CopyToClipboard text={String(children).replace(/\n$/, "")} />
                  </div>
                ) : (
                  <code {...rest} className={className + "-mt-4 mb-8"}>
                    {children}
                  </code>
                );
              },
              img(props) {
                const { alt, src } = props;
                return (
                  <span className="flex justify-center items-center m-auto">
                    <img className="max-w-xl h-auto " src={src} alt={alt} />
                  </span>
                );
              },
              ul(props) {
                return <ul className="mb-8 -mt-8">{props.children}</ul>;
              },
              ol(props) {
                return <ol className="mb-8 -mt-8">{props.children}</ol>;
              },
              h2(props) {
                return (
                  <h2 className="font-extrabold text-xl mb-4 mt-8" id={props.children}>
                    {props.children}
                  </h2>
                );
              },
              p(props) {
                return (
                  <p id="md" className="mb-0">
                    {props.children}
                  </p>
                );
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
