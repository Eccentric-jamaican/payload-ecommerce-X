import { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate'],
    group: 'Content',
  },
  access: {
    read: anyone, // Anyone can read blogs
    create: isAdmin, // Only admins can create
    update: isAdmin, // Only admins can update
    delete: isAdmin, // Only admins can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        description: 'A URL-friendly version of the title. No spaces or special characters allowed.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'topics',
      type: 'relationship',
      relationTo: 'blog-topics',
      hasMany: true,
      admin: {
        description: 'Tag this article with relevant topics to power filtering.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          value: 'draft',
          label: 'Draft',
        },
        {
          value: 'published',
          label: 'Published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }: { data: any; req: any; operation: 'create' | 'update' }) => {
        // Automatically generate slug from title if not provided
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        
        if (operation === 'create') {
          // Automatically set the author to the current user
          if (req.user) {
            return {
              ...data,
              author: req.user.id,
            };
          }
        }
        return data;
      },
    ],
  },
};

export default Blogs;
