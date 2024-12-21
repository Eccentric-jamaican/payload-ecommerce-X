import CategoryPageClient from "./page.client";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <CategoryPageClient slug={slug} />;
};

export default CategoryPage;
