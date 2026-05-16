import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanityIntegration';

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

export type SanityImage = {
  _key?: string;
  asset?: {
    _id: string;
  };
};

export type SanityImageUrlOptions = {
  width?: number;
  quality?: number;
};

export const IMAGE_WIDTHS = {
  hero: 1800,
  grid: 600,
  gallery: 1440,
  about: 960,
} as const;

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function getSanityImageUrl(
  source: SanityImageSource | undefined | null,
  { width, quality = 80 }: SanityImageUrlOptions = {}
): string | undefined {
  if (!source) return undefined;

  let chain = urlFor(source).quality(quality).auto('format');
  if (width != null) {
    chain = chain.width(width);
  }

  return chain.url();
}
