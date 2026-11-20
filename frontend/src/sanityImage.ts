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
  width: number;
  height?: number;
  quality?: number;
  fit?: 'crop' | 'clip' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
};

export const IMAGE_WIDTHS = {
  hero: 1800,
  grid: 600,
  gallery: 1440,
  scatter: 480,
  about: 960,
} as const;

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function getSanityImageUrl(
  source: SanityImageSource | undefined | null,
  { width, height, quality = 80, fit }: SanityImageUrlOptions
): string | undefined {
  if (!source) return undefined;

  let chain = urlFor(source).width(width).auto('format').quality(quality);
  if (height != null) {
    chain = chain.height(height);
  }
  if (fit) {
    chain = chain.fit(fit);
  }

  return chain.url();
}

/** Append Sanity CDN transform params to a raw asset URL. */
export function optimizeSanityImage(
  url: string,
  { width, height, quality = 80, fit }: SanityImageUrlOptions
): string {
  const params = new URLSearchParams({
    w: String(width),
    q: String(quality),
    auto: 'format',
  });
  if (height) {
    params.set('h', String(height));
  }
  if (fit) {
    params.set('fit', fit);
  }
  return `${url}?${params.toString()}`;
}

export function buildSanityImageSrcSet(
  source: SanityImageSource | undefined | null,
  options: SanityImageUrlOptions,
  densities: number[] = [1, 2]
): string | undefined {
  if (!source) return undefined;

  return densities
    .map((dpr) => {
      const url = getSanityImageUrl(source, {
        ...options,
        width: Math.round(options.width * dpr),
        height:
          options.height != null ? Math.round(options.height * dpr) : undefined,
      });
      return url ? `${url} ${dpr}x` : null;
    })
    .filter((entry): entry is string => Boolean(entry))
    .join(', ');
}

export function buildSanityImageSrcSetFromUrl(
  url: string,
  options: SanityImageUrlOptions,
  densities: number[] = [1, 2]
): string {
  return densities
    .map((dpr) => {
      const optimized = optimizeSanityImage(url, {
        ...options,
        width: Math.round(options.width * dpr),
        height: options.height ? Math.round(options.height * dpr) : undefined,
      });
      return `${optimized} ${dpr}x`;
    })
    .join(', ');
}
