import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: {
    singular: 'Media & Copy',
    plural: 'Media & Copy Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body Copy',
      editor: lexicalEditor(),
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
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
      name: 'mediaPosition',
      type: 'select',
      label: 'Media Position Override',
      options: [
        { label: 'Auto (alternate)', value: 'auto' },
        { label: 'Image left', value: 'image-left' },
        { label: 'Image right', value: 'image-right' },
      ],
      defaultValue: 'auto',
      admin: {
        description: 'Overrides the automatic left/right alternation if needed.',
      },
    },
  ],
};

