import React from "react";
import { Metadata } from "next";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { serializeLexical } from "./lexical-serializer";

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const payload = await getPayloadHMR({ config });

  const blog = await payload.find({
    depth: 1,
    collection: "blogs",
    where: {
      slug: {
        equals: params.slug,
      },
      status: {
        equals: "published",
      },
    },
  });

  if (!blog.docs[0]) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const post = blog.docs[0];

  return {
    title: `${post.title} | My E-commerce Store`,
    description: post.excerpt,
  };
}

const BlogPostPage = async ({ params }: BlogPostProps) => {
  const payload = await getPayloadHMR({ config });

  const blog = await payload.find({
    depth: 1,
    collection: "blogs",
    where: {
      slug: {
        equals: params.slug,
      },
      status: {
        equals: "published",
      },
    },
  });

  if (!blog.docs[0]) {
    notFound();
  }

  const post = blog.docs[0];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <article>
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

        <div className="mb-6 flex items-center text-gray-600">
          <span>
            Published on {new Date(post.publishedDate).toLocaleDateString()}
          </span>
          {typeof post.author !== 'string' && post.author && (
            <>
              <span className="mx-2">•</span>
              <span>
                By {post.author.firstName} {post.author.lastName}
              </span>
            </>
          )}
        </div>

        {typeof post.featuredImage !== 'string' && post.featuredImage && (
          <img
            src={post.featuredImage.url}
            alt={post.title}
            className="mb-8 h-96 w-full rounded-lg object-cover"
          />
        )}

        <div className="prose max-w-none">
          {/* Render rich text content */}
          {post.content && (
            <div className="blog-content">
              {serializeLexical(post.content)}
            </div>
          )}
        </div>
      </article>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <a
          href="/blog"
          className="font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Blog
        </a>
      </div>
    </div>
  );
};

export default BlogPostPage;
