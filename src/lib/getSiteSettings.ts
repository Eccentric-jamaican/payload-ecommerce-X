import configPromise from '@/payload.config';
import type { SiteSetting } from '@/payload-types';
import { getPayload } from 'payload';
import { cache } from 'react';

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayload({
    config: configPromise,
  });

  return payload.findGlobal({
    slug: 'site-settings',
    depth: 2,
  });
});
