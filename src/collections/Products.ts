import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';

const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'productCode', 'status', 'updatedAt'],
    group: 'Products',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Product Name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description:
              'Auto-generated from the name if left blank. Used for the product URL.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'productCode',
          label: 'SKU / Product Code',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Discontinued', value: 'discontinued' },
          ],
        },
      ],
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'text',
      admin: {
        description: 'Shown on product cards and listings. Keep under 180 characters.',
      },
    },
    {
      name: 'description',
      label: 'Detailed Description',
      type: 'richText',
      editor: lexicalEditor(),
      admin: {
        description: 'Full product narrative. Supports headings, lists, quotes, and media.',
      },
    },
    {
      name: 'mediaGallery',
      label: 'Media Gallery',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Upload imagery that showcases the product.',
      },
      fields: [
        {
          name: 'asset',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          label: 'Caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'videoUrl',
      label: 'YouTube Embed URL',
      type: 'text',
      admin: {
        description: 'Optional YouTube link that will be embedded on the product page.',
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'keyUses',
      label: 'Key Uses',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'technicalSpecs',
      label: 'Technical Specifications',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Specification',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inStock',
          label: 'In Stock',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          type: 'group',
          name: 'cta',
          label: 'Contact CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'CTA Label',
              admin: {
                placeholder: 'Request a quote',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'CTA URL',
              admin: {
                placeholder: 'mailto:procurement@alphamed.global',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      label: 'Categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'clinicalAreas',
      label: 'Clinical Areas',
      type: 'relationship',
      relationTo: 'clinical-areas',
      hasMany: true,
    },
    {
      name: 'productFamily',
      label: 'Product Family',
      type: 'relationship',
      relationTo: 'product-families',
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return data;
      },
    ],
  },
};

export default Products;
