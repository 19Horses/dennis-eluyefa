import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Loading } from '../../components/Loading';
import { useGetGallery } from '../../queries/useGetGallery';
import {
  buildSanityImageSrcSet,
  getSanityImageUrl,
  IMAGE_WIDTHS,
} from '../../sanityImage';
import { GalleryContainer, ScatterImage } from './styles';

const SCATTER_OPTIONS = { width: IMAGE_WIDTHS.scatter };
const MIN_DISPLAY_WIDTH = 140;
const MAX_DISPLAY_WIDTH = 280;

type ScatterItem = {
  id: string;
  src: string;
  srcSet?: string;
  x: number;
  y: number;
  width: number;
  delay: number;
};

type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

function Gallery() {
  const { data, isLoading, isError } = useGetGallery();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<ScatterItem[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const placedKeyRef = useRef<string | null>(null);

  const imageSources = useMemo(() => {
    const sources: Array<{ id: string; src: string; srcSet?: string }> = [];

    for (const img of data?.images ?? []) {
      const src = getSanityImageUrl(img, SCATTER_OPTIONS);
      if (!src) continue;
      sources.push({
        id: img._key,
        src,
        srcSet: buildSanityImageSrcSet(img, SCATTER_OPTIONS),
      });
    }

    return sources;
  }, [data?.images]);

  const placeImages = useCallback(() => {
    const container = containerRef.current;
    if (!container || imageSources.length === 0) {
      setItems([]);
      return;
    }

    const bounds = container.getBoundingClientRect();
    const nextItems: ScatterItem[] = imageSources.map((image, index) => {
      const width = Math.round(
        randomBetween(MIN_DISPLAY_WIDTH, MAX_DISPLAY_WIDTH)
      );
      const estimatedHeight = width * 1.25;
      const maxX = Math.max(bounds.width - width, 0);
      const maxY = Math.max(bounds.height - estimatedHeight, 0);

      return {
        id: image.id,
        src: image.src,
        srcSet: image.srcSet,
        width,
        x: randomBetween(0, maxX),
        y: randomBetween(0, maxY),
        delay: index * 0.12,
      };
    });

    setItems(nextItems);
  }, [imageSources]);

  useEffect(() => {
    const placementKey = imageSources.map((image) => image.id).join('|');
    if (!placementKey) {
      placedKeyRef.current = null;
      setItems([]);
      return;
    }

    if (placedKeyRef.current === placementKey && items.length > 0) {
      return;
    }

    placedKeyRef.current = placementKey;
    placeImages();
  }, [imageSources, items.length, placeImages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setItems((current) => {
        if (current.length === 0) return current;
        const bounds = container.getBoundingClientRect();

        return current.map((item) => {
          const maxX = Math.max(bounds.width - item.width, 0);
          const maxY = Math.max(bounds.height - item.width * 1.25, 0);
          return {
            ...item,
            x: clamp(item.x, 0, maxX),
            y: clamp(item.y, 0, maxY),
          };
        });
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLImageElement>,
    item: ScatterItem
  ) => {
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);

    setDrag({
      id: item.id,
      offsetX: event.clientX - bounds.left - item.x,
      offsetY: event.clientY - bounds.top - item.y,
      pointerId: event.pointerId,
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const target = items.find((item) => item.id === drag.id);
    if (!target) return;

    const imageEl = container.querySelector<HTMLImageElement>(
      `[data-scatter-id="${drag.id}"]`
    );
    const imageHeight =
      imageEl?.getBoundingClientRect().height ?? target.width * 1.25;
    const maxX = Math.max(bounds.width - target.width, 0);
    const maxY = Math.max(bounds.height - imageHeight, 0);
    const nextX = clamp(event.clientX - bounds.left - drag.offsetX, 0, maxX);
    const nextY = clamp(event.clientY - bounds.top - drag.offsetY, 0, maxY);

    setItems((current) =>
      current.map((item) =>
        item.id === drag.id ? { ...item, x: nextX, y: nextY } : item
      )
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    if (event.pointerId !== drag.pointerId) return;
    setDrag(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <GalleryContainer
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {items.map((item) => (
        <ScatterImage
          key={item.id}
          data-scatter-id={item.id}
          src={item.src}
          srcSet={item.srcSet}
          alt=""
          draggable={false}
          $delay={item.delay}
          $width={item.width}
          $dragging={drag?.id === item.id}
          style={{ left: item.x, top: item.y }}
          onPointerDown={(event) => handlePointerDown(event, item)}
        />
      ))}
    </GalleryContainer>
  );
}

export default Gallery;
