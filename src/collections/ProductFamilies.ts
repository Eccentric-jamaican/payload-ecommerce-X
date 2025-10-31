import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';

const ProductFamilies: CollectionConfig = {
  slug: 'product-families',
  labels: {
    singular: 'Product Family',
    plural: 'Product Families',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    group: 'Products',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
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
        description: 'Used in URLs and internal references.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
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

export default ProductFamilies;
