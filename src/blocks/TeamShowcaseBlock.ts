import type { Block } from 'payload';

export const TeamShowcaseBlock: Block = {
  slug: 'teamShowcase',
  labels: {
    singular: 'Team Showcase',
    plural: 'Team Showcases',
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
            placeholder: '/team',
          },
        },
      ],
    },
    {
      name: 'viewAllUrl',
      type: 'text',
      label: 'View All URL',
      admin: {
        placeholder: '/team',
      },
    },
    {
      name: 'members',
      type: 'array',
      label: 'Team Members',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'bio',
          type: 'textarea',
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          admin: {
            placeholder: 'https://linkedin.com/in/username',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Portrait',
        },
      ],
    },
  ],
};

