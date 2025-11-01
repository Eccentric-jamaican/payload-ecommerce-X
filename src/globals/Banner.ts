import type { GlobalConfig } from 'payload';

export const Banner: GlobalConfig = {
  slug: 'banner',
  label: 'Banner Messages',
  admin: {
    description: 'Manage banner messages that appear at the top of the site',
    group: 'Site',
  },
  access: {
    read: (): boolean => true, // Publicly accessible
    update: ({ req: { user } }): boolean => {
      return user?.role === 'admin';
    },
  },
  fields: [
    {
      name: 'banners',
      type: 'array',
      label: 'Banner Messages',
      minRows: 1,
      maxRows: 5, // Limit number of banners
      labels: {
        singular: 'Banner',
        plural: 'Banners',
      },
      fields: [
        {
          name: 'message',
          type: 'text',
          required: true,
          label: 'Banner Text',
          admin: {
            description: 'Supports emojis and basic text formatting',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Background Color',
          options: [
            { label: 'Blue', value: 'bg-blue-500' },
            { label: 'Green', value: 'bg-green-500' },
            { label: 'Red', value: 'bg-red-500' },
            { label: 'Yellow', value: 'bg-yellow-500' },
            { label: 'Purple', value: 'bg-purple-500' },
          ],
          defaultValue: 'bg-blue-500',
          required: true,
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active',
          defaultValue: true,
        },
      ],
    },
  ],
};

export default Banner;
