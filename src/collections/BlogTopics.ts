import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';

const BlogTopics: CollectionConfig = {
  slug: 'blog-topics',
  labels: {
    singular: 'Blog Topic',
    plural: 'Blog Topics',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Topic Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Topic Slug',
      required: true,
      unique: true,
      admin: {
        description: 'Used in URLs and filters (e.g. supply-chain).',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return data;
      },
    ],
  },
};

export default BlogTopics;
