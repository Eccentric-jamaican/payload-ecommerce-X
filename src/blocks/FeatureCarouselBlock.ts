import type { Block } from 'payload';

export const FeatureCarouselBlock: Block = {
  slug: 'featureCarousel',
  labels: {
    singular: 'Feature Carousel',
    plural: 'Feature Carousels',
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
      name: 'slides',
      type: 'array',
      label: 'Slides',
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
          type: 'group',
          name: 'cta',
          label: 'Slide CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                placeholder: '/contact',
              },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
      ],
    },
  ],
};

