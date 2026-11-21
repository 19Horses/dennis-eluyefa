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
import {
  DecelToggle,
  DecelTrack,
  GalleryContainer,
  ScatterImage,
} from './styles';

const SCATTER_OPTIONS = { width: IMAGE_WIDTHS.scatter };
const MIN_DISPLAY_WIDTH = 140;
const MAX_DISPLAY_WIDTH = 280;
/** Inset from container edges on both axes */
const SCATTER_PADDING = 16;
const FLING_MIN_SPEED = 0.03; // px/ms
const FLING_MAX_SPEED = 2.4; // px/ms
/** How strongly release velocity maps to slide (1 = match mouse px/ms) */
const FLING_GAIN = 1;
/** Base exponential friction; reduced when flinging faster so coast tracks mouse speed */
const FLING_FRICTION_BASE = 0.93;
const FLING_FRICTION_FAST = 0.965;
const VELOCITY_HISTORY = 5;
/** Bounce energy kept on wall / ceiling hits */
const FLING_BOUNCE = 0.62;

type ScatterItem = {
  id: string;
  src: string;
  srcSet?: string;
  x: number;
  y: number;
  width: number;
  delay: number;
  zIndex: number;
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
  const [decelOn, setDecelOn] = useState(true);
  const placedKeyRef = useRef<string | null>(null);
  const topZRef = useRef(1);
  const decelOnRef = useRef(decelOn);
  decelOnRef.current = decelOn;
  const dragSampleRef = useRef({
    x: 0,
    y: 0,
    t: 0,
    samples: [] as Array<{ vx: number; vy: number; w: number }>,
  });
  const inertiaRafRef = useRef<number | null>(null);
  const inertiaLastRef = useRef(0);

  const readReleaseVelocity = () => {
    const samples = dragSampleRef.current.samples;
    if (samples.length === 0) return { vx: 0, vy: 0 };

    let wSum = 0;
    let vx = 0;
    let vy = 0;
    samples.forEach((sample, index) => {
      // Prefer the most recent mouse movement
      const w = sample.w * (index + 1);
      wSum += w;
      vx += sample.vx * w;
      vy += sample.vy * w;
    });

    return {
      vx: (vx / wSum) * FLING_GAIN,
      vy: (vy / wSum) * FLING_GAIN,
    };
  };

  const stopInertia = useCallback(() => {
    if (inertiaRafRef.current !== null) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  }, []);

  useEffect(() => () => stopInertia(), [stopInertia]);

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
      const maxX = Math.max(
        bounds.width - width - SCATTER_PADDING,
        SCATTER_PADDING
      );
      const maxY = Math.max(
        bounds.height - estimatedHeight - SCATTER_PADDING,
        SCATTER_PADDING
      );

      return {
        id: image.id,
        src: image.src,
        srcSet: image.srcSet,
        width,
        x: randomBetween(SCATTER_PADDING, maxX),
        y: randomBetween(SCATTER_PADDING, maxY),
        delay: index * 0.12,
        zIndex: index + 1,
      };
    });

    topZRef.current = nextItems.length;
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
          const maxX = Math.max(
            bounds.width - item.width - SCATTER_PADDING,
            SCATTER_PADDING
          );
          const maxY = Math.max(
            bounds.height - item.width * 1.25 - SCATTER_PADDING,
            SCATTER_PADDING
          );
          return {
            ...item,
            x: clamp(item.x, SCATTER_PADDING, maxX),
            y: clamp(item.y, SCATTER_PADDING, maxY),
          };
        });
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getItemBounds = useCallback(
    (item: ScatterItem, imageHeight: number) => {
      const container = containerRef.current;
      if (!container) {
        return { maxX: SCATTER_PADDING, maxY: SCATTER_PADDING };
      }
      const bounds = container.getBoundingClientRect();
      return {
        maxX: Math.max(
          bounds.width - item.width - SCATTER_PADDING,
          SCATTER_PADDING
        ),
        maxY: Math.max(
          bounds.height - imageHeight - SCATTER_PADDING,
          SCATTER_PADDING
        ),
      };
    },
    []
  );

  const startInertia = useCallback(
    (id: string, releaseVx: number, releaseVy: number) => {
      stopInertia();

      let vx = releaseVx;
      let vy = releaseVy;
      let speed = Math.hypot(vx, vy);
      if (speed < FLING_MIN_SPEED) return;
      if (speed > FLING_MAX_SPEED) {
        const scale = FLING_MAX_SPEED / speed;
        vx *= scale;
        vy *= scale;
        speed = FLING_MAX_SPEED;
      }

      // Faster mouse release → less friction → longer slide; slow → short coast
      const speedT = clamp(speed / FLING_MAX_SPEED, 0, 1);
      const friction =
        FLING_FRICTION_BASE +
        (FLING_FRICTION_FAST - FLING_FRICTION_BASE) * speedT;

      inertiaLastRef.current = performance.now();

      const tick = (now: number) => {
        const container = containerRef.current;
        if (!container) {
          inertiaRafRef.current = null;
          return;
        }

        const dt = Math.min(now - inertiaLastRef.current, 32);
        inertiaLastRef.current = now;
        const decay = Math.pow(friction, dt / 16.67);
        vx *= decay;
        vy *= decay;

        if (Math.hypot(vx, vy) < FLING_MIN_SPEED) {
          inertiaRafRef.current = null;
          return;
        }

        setItems((current) => {
          const target = current.find((item) => item.id === id);
          if (!target) return current;

          const imageEl = container.querySelector<HTMLImageElement>(
            `[data-scatter-id="${id}"]`
          );
          const imageHeight =
            imageEl?.getBoundingClientRect().height ?? target.width * 1.25;
          const { maxX, maxY } = getItemBounds(target, imageHeight);
          let nextX = target.x + vx * dt;
          let nextY = target.y + vy * dt;

          if (nextX <= SCATTER_PADDING || nextX >= maxX) {
            nextX = clamp(nextX, SCATTER_PADDING, maxX);
            vx *= -FLING_BOUNCE;
          }
          if (nextY <= SCATTER_PADDING || nextY >= maxY) {
            nextY = clamp(nextY, SCATTER_PADDING, maxY);
            vy *= -FLING_BOUNCE;
          }

          return current.map((item) =>
            item.id === id ? { ...item, x: nextX, y: nextY } : item
          );
        });

        if (Math.hypot(vx, vy) < FLING_MIN_SPEED) {
          inertiaRafRef.current = null;
          return;
        }

        inertiaRafRef.current = requestAnimationFrame(tick);
      };

      inertiaRafRef.current = requestAnimationFrame(tick);
    },
    [getItemBounds, stopInertia]
  );

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLImageElement>,
    item: ScatterItem
  ) => {
    event.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    stopInertia();

    const bounds = container.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);

    topZRef.current += 1;
    const nextZ = topZRef.current;

    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, zIndex: nextZ } : entry
      )
    );

    const now = performance.now();
    dragSampleRef.current = {
      x: item.x,
      y: item.y,
      t: now,
      samples: [],
    };

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
    const { maxX, maxY } = getItemBounds(target, imageHeight);
    const nextX = clamp(
      event.clientX - bounds.left - drag.offsetX,
      SCATTER_PADDING,
      maxX
    );
    const nextY = clamp(
      event.clientY - bounds.top - drag.offsetY,
      SCATTER_PADDING,
      maxY
    );

    const now = performance.now();
    const sample = dragSampleRef.current;
    const dt = now - sample.t;
    if (dt > 0 && dt < 64) {
      sample.samples.push({
        vx: (nextX - sample.x) / dt,
        vy: (nextY - sample.y) / dt,
        w: dt,
      });
      if (sample.samples.length > VELOCITY_HISTORY) {
        sample.samples.shift();
      }
    }
    sample.x = nextX;
    sample.y = nextY;
    sample.t = now;

    setItems((current) =>
      current.map((item) =>
        item.id === drag.id ? { ...item, x: nextX, y: nextY } : item
      )
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    if (event.pointerId !== drag.pointerId) return;

    // Fold the final pointer sample into velocity so release matches mouse speed
    const container = containerRef.current;
    const target = items.find((item) => item.id === drag.id);
    if (container && target) {
      const bounds = container.getBoundingClientRect();
      const imageEl = container.querySelector<HTMLImageElement>(
        `[data-scatter-id="${drag.id}"]`
      );
      const imageHeight =
        imageEl?.getBoundingClientRect().height ?? target.width * 1.25;
      const { maxX, maxY } = getItemBounds(target, imageHeight);
      const nextX = clamp(
        event.clientX - bounds.left - drag.offsetX,
        SCATTER_PADDING,
        maxX
      );
      const nextY = clamp(
        event.clientY - bounds.top - drag.offsetY,
        SCATTER_PADDING,
        maxY
      );
      const now = performance.now();
      const sample = dragSampleRef.current;
      const dt = now - sample.t;
      if (dt > 0 && dt < 64) {
        sample.samples.push({
          vx: (nextX - sample.x) / dt,
          vy: (nextY - sample.y) / dt,
          w: dt,
        });
        if (sample.samples.length > VELOCITY_HISTORY) {
          sample.samples.shift();
        }
      }
    }

    const { vx, vy } = readReleaseVelocity();
    const id = drag.id;
    setDrag(null);
    if (decelOnRef.current) {
      startInertia(id, vx, vy);
    }
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
          style={{ left: item.x, top: item.y, zIndex: item.zIndex }}
          onPointerDown={(event) => handlePointerDown(event, item)}
        />
      ))}

      <DecelToggle
        type="button"
        $on={decelOn}
        aria-pressed={decelOn}
        aria-label={`Deceleration ${decelOn ? 'on' : 'off'}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          setDecelOn((on) => {
            if (on) stopInertia();
            return !on;
          });
        }}
      >
        <DecelTrack $on={decelOn} aria-hidden />
        {decelOn ? 'on' : 'off'}
      </DecelToggle>
    </GalleryContainer>
  );
}

export default Gallery;
