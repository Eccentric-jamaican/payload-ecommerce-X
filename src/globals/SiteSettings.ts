import { isAdmin } from '@/access/admin';
import { anyone } from '@/access/anyone';
import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Manage global branding, navigation, and contact details used throughout the site.',
    group: 'Site',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Primary Logo',
              admin: {
                description: 'Displayed in the site header and footer.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary Color',
                  required: true,
                  defaultValue: '#4FB8FF',
                  admin: {
                    description: 'Hex or CSS color value used for primary accents.',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Secondary Accent Color',
                  required: true,
                  defaultValue: '#4FB8FF',
                  admin: {
                    description: 'Applied to secondary buttons or highlights.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'textColor',
                  type: 'text',
                  label: 'Primary Text Color',
                  required: true,
                  defaultValue: '#111827',
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: 'Page Background Color',
                  required: true,
                  defaultValue: '#FFFFFF',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fontFamily',
                  type: 'text',
                  label: 'Font Family',
                  required: true,
                  defaultValue: 'Poppins, sans-serif',
                  admin: {
                    description: 'CSS font stack for headings and body copy.',
                  },
                },
                {
                  name: 'headingFontWeight',
                  type: 'select',
                  label: 'Heading Font Weight',
                  defaultValue: '500',
                  options: [
                    { label: 'Regular (400)', value: '400' },
                    { label: 'Medium (500)', value: '500' },
                    { label: 'Semi-bold (600)', value: '600' },
                    { label: 'Bold (700)', value: '700' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & CTA',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'supportEmail',
                  type: 'email',
                  label: 'Support Email',
                  required: true,
                  admin: {
                    description: 'Primary email for inbound enquiries.',
                  },
                },
                {
                  name: 'salesEmail',
                  type: 'email',
                  label: 'Sales Email',
                  admin: {
                    description: 'Optional email for sales-specific enquiries.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryPhone',
                  type: 'text',
                  label: 'Primary Phone Number',
                },
                {
                  name: 'secondaryPhone',
                  type: 'text',
                  label: 'Secondary Phone Number',
                },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Office Address',
            },
            {
              name: 'cta',
              label: 'Default Call To Action',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'CTA Label',
                  required: true,
                  defaultValue: 'Contact Alphamed',
                },
                {
                  name: 'href',
                  type: 'text',
                  label: 'CTA Link',
                  required: true,
                  defaultValue: 'tel:+15551234567',
                },
                {
                  name: 'subtext',
                  type: 'textarea',
                  label: 'Supporting Text',
                  admin: {
                    description: 'Optional line displayed under the main CTA.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'primaryNavigation',
              label: 'Primary Navigation Links',
              type: 'array',
              labels: {
                singular: 'Navigation Item',
                plural: 'Navigation Items',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Can be an absolute URL or relative path (e.g. /about).',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  label: 'Open in new tab',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'utilityNavigation',
              label: 'Utility Navigation Links',
              type: 'array',
              admin: {
                description: 'Optional secondary navigation (e.g. top-right links).',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  label: 'Open in new tab',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Blog',
          fields: [
            {
              type: 'group',
              name: 'blogHero',
              label: 'Blog Hero',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Hero Heading',
                  defaultValue: 'New at Alphamed Blog',
                },
                {
                  name: 'subheading',
                  type: 'textarea',
                  label: 'Hero Description',
                  defaultValue:
                    'A collection of stories about our people, our capabilities and our products.',
                },
              ],
            },
            {
              name: 'blogSocialLinks',
              label: 'Hero Social Links',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  label: 'Platform',
                  type: 'select',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Profile URL',
                },
              ],
            },
            {
              type: 'group',
              name: 'blogNewsletter',
              label: 'Newsletter Callout',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show newsletter card on listing page',
                  defaultValue: false,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Card Heading',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Supporting Copy',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaLabel',
                      type: 'text',
                      label: 'CTA Label',
                      admin: {
                        condition: (_, siblingData) => Boolean(siblingData?.enabled),
                      },
                    },
                    {
                      name: 'ctaUrl',
                      type: 'text',
                      label: 'CTA URL',
                      admin: {
                        condition: (_, siblingData) => Boolean(siblingData?.enabled),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Products',
          fields: [
            {
              type: 'group',
              name: 'productHero',
              label: 'Products Hero',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Hero Heading',
                  defaultValue: 'Equip every facility with Alphamed',
                },
                {
                  name: 'subheading',
                  type: 'textarea',
                  label: 'Hero Description',
                  defaultValue:
                    'Browse the Alphamed Global catalogue to discover vetted medical supplies, equipment, and logistics solutions.',
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Footer Columns',
              labels: {
                singular: 'Footer Column',
                plural: 'Footer Columns',
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Column Heading',
                  required: true,
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      label: 'Open in new tab',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Links',
              admin: {
                description: 'List of social media or external resources.',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon Key',
                  admin: {
                    description: 'Used by the frontend to match an icon (e.g. linkedin, twitter).',
                  },
                },
              ],
            },
            {
              name: 'footerNote',
              type: 'textarea',
              label: 'Footer Note / Copyright',
            },
          ],
        },
      ],
    },
  ],
};

export default SiteSettings;
