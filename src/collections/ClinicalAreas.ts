import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';

const ClinicalAreas: CollectionConfig = {
  slug: 'clinical-areas',
  labels: {
    singular: 'Clinical Area',
    plural: 'Clinical Areas',
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
        description: 'Used in filters (e.g. maternal-health).',
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

export default ClinicalAreas;
