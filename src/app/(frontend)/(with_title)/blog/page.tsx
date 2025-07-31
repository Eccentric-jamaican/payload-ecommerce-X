import React from "react";
import { Metadata } from "next";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | My E-commerce Store",
  description: "Latest news and updates from our store",
};

const BlogPage = async () => {
  const payload = await getPayloadHMR({ config });

  const blogs = await payload.find({
    depth: 1,
    collection: "blogs",
    where: {
      status: {
        equals: "published",
      },
    },
    sort: "-publishedDate",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      {blogs.docs.length === 0 ? (
        <p className="text-gray-500">No blog posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.docs.map((blog) => (
            <div
              key={blog.id}
              className="overflow-hidden rounded-lg border shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              {typeof blog.featuredImage !== 'string' && blog.featuredImage && (
                <img
                  src={blog.featuredImage.url}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="mb-2 text-xl font-bold">{blog.title}</h2>
                <p className="mb-4 text-gray-600">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(blog.publishedDate).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
