import type { Block } from 'payload';

export const ProductHighlightsBlock: Block = {
  slug: 'productHighlights',
  labels: {
    singular: 'Product Highlights',
    plural: 'Product Highlights Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Copy',
    },
    {
      type: 'group',
      name: 'cta',
      label: 'Section CTA',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            placeholder: '/products',
          },
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlight Cards',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Stethoscope', value: 'stethoscope' },
            { label: 'Shield Check', value: 'shield-check' },
            { label: 'Package', value: 'package' },
          ],
        },
        {
          type: 'group',
          name: 'cta',
          label: 'Card CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                placeholder: '/products',
              },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Optional Image',
        },
      ],
    },
  ],
};

