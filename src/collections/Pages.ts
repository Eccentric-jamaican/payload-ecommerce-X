import { pageBlocks } from '@/blocks';
import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';
import type { CollectionConfig } from 'payload';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Site',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
              unique: true,
              admin: {
                description: 'Used for the page URL, e.g. "about-us".',
              },
            },
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'standard',
              options: [
                { label: 'Standard', value: 'standard' },
                { label: 'Alternating', value: 'alternating' },
              ],
              admin: {
                description:
                  'Standard keeps media blocks consistent. Alternating flips media/text per section for visual rhythm.',
              },
            },
            {
              name: 'heroPreview',
              type: 'group',
              label: 'Hero Preview',
              admin: {
                description: 'Optional summary shown in admin listings and page previews.',
              },
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Eyebrow',
                },
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Heading',
                },
                {
                  name: 'subheading',
                  type: 'textarea',
                  label: 'Subheading',
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                },
              ],
            },
            {
              name: 'sections',
              label: 'Sections',
              type: 'blocks',
              blocks: pageBlocks,
              admin: {
                description:
                  'Add flexible content blocks to construct the page. More block types can be added over time.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              admin: {
                description: 'Suggested max 60 characters.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              admin: {
                description: 'Suggested max 160 characters.',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Open Graph Image',
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'status',
              type: 'select',
              label: 'Status',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Published At',
              admin: {
                description: 'Optional date for when this page went live.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data?.title && !data.slug) {
          data.slug = slugify(data.title);
        }

        if (data?.slug) {
          data.slug = slugify(data.slug);
        }

        if (data?.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }

        return data;
      },
    ],
  },
};

export default Pages;
