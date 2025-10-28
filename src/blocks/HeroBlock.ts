import type { Block } from 'payload';

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        description: 'Primary headline shown prominently on the page.',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: {
        description: 'Support copy that appears beneath the heading.',
      },
    },
    {
      type: 'group',
      name: 'cta',
      label: 'Call To Action',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
          admin: {
            placeholder: '/contact',
          },
        },
      ],
    },
    {
      name: 'layoutStyle',
      type: 'select',
      label: 'Layout Style',
      defaultValue: 'split',
      options: [
        { label: 'Split (media beside copy)', value: 'split' },
        { label: 'Overlay (image behind copy)', value: 'overlay' },
      ],
      admin: {
        description: 'Choose how the hero image is positioned relative to the copy.',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Optional backdrop that displays beside or behind the hero copy.',
      },
    },
  ],
};
