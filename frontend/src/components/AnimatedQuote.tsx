import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import Matter from 'matter-js';
import Sketch from 'react-p5';
import type p5Types from 'p5';
import { styled } from 'styled-components';

const QuoteStage = styled.div<{ $monochrome: boolean }>`
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  cursor: ${({ $monochrome }) => ($monochrome ? 'auto' : 'none')};
  overflow: hidden;

  /* react-p5 wraps the canvas in a div that otherwise shrinks to canvas size */
  & > .react-p5 {
    width: 100% !important;
    height: 100% !important;
    min-height: 0;
    display: block;
  }

  & > .react-p5 > canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
`;

type AnimatedQuoteProps = {
  quote: string;
  monochrome?: boolean;
};

type Letter = {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  revealed: boolean;
  color: string;
  targetColor: string;
  isPaintTarget: boolean;
  painted: boolean;
  body: Matter.Body | null;
};

const REVEAL_INTERVAL_MS = 50;
const CURSOR_SIZE = 20;
const CURSOR_ACTIVE_SIZE = 60;
const CURSOR_PUSH_RADIUS = 56;
const CURSOR_PUSH_STRENGTH = 0.08;

const COLORS = {
  white: '#FFFFFF',
  pink: '#F000B6',
  blue: '#83b7ed',
  green: '#60d521',
  purple: '#9f2ade',
  yellow: '#efe026',
  red: '#d2261a',
  brown: '#7c4812',
};

const LETTER_COLOR_SEQUENCE = [
  COLORS.white, // i
  COLORS.pink, // j
  COLORS.blue, // u
  COLORS.green, // s
  COLORS.purple, // t
  COLORS.yellow, // w
  COLORS.green, // a
  COLORS.red, // n
  COLORS.white, // t
  COLORS.pink, // t
  COLORS.brown, // o
  COLORS.purple, // c
  COLORS.red, // r
  COLORS.blue, // e
  COLORS.yellow, // a
  COLORS.white, // t
  COLORS.pink, // e
  COLORS.white, // i
  COLORS.green, // m
  COLORS.blue, // a
  COLORS.brown, // g
  COLORS.yellow, // e
  COLORS.red, // s
  COLORS.blue, // f
  COLORS.green, // u
  COLORS.pink, // l
  COLORS.yellow, // l
  COLORS.purple, // (extra colors if needed)
  COLORS.white,
  COLORS.white,
  COLORS.brown,
  COLORS.red,
  COLORS.blue,
];

const BACKGROUND = '#000000';

const isQuoteChar = (char: string) => /["“”„‟]/.test(char);

const isFullStopChar = (char: string) =>
  char === '.' || char === '!' || char === '?' || char === '。';

export const AnimatedQuote = ({
  quote,
  monochrome = false,
}: AnimatedQuoteProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fontUrl = new URL('../assets/HelveticaNeue-Bold.otf', import.meta.url)
    .href;
  const fontRef = useRef<p5Types.Font | null>(null);
  const lettersRef = useRef<Letter[]>([]);
  const textSizeRef = useRef<number>(64);
  const lastRevealAtRef = useRef<number>(0);
  const revealedCountRef = useRef<number>(0);
  const maxWidthRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const monochromeRef = useRef(monochrome);
  monochromeRef.current = monochrome;
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const paintedCountRef = useRef(0);
  const physicsEnabledRef = useRef(false);
  const engineRef = useRef<Matter.Engine | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const isHoveringRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const mousePosRef = useRef({ x: -9999, y: -9999 });

  const getPaintTargets = () =>
    lettersRef.current.filter((letter) => letter.isPaintTarget);

  const getNextPaintColor = () => {
    const next = getPaintTargets().find((letter) => !letter.painted);
    if (next) return next.targetColor;
    const targets = getPaintTargets();
    return targets[targets.length - 1]?.targetColor ?? COLORS.pink;
  };

  const updateCursorAppearance = () => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const size = isMouseDownRef.current ? CURSOR_ACTIVE_SIZE : CURSOR_SIZE;
    cursor.style.width = `${size}px`;
    cursor.style.height = `${size}px`;
    cursor.style.backgroundColor = getNextPaintColor();
    cursor.style.opacity = isHoveringRef.current ? '1' : '0';
  };

  const clearPhysics = () => {
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    physicsEnabledRef.current = false;
    lettersRef.current.forEach((letter) => {
      letter.body = null;
    });
  };

  const containBodies = (width: number, height: number) => {
    lettersRef.current.forEach((letter) => {
      const body = letter.body;
      if (!body) return;

      const halfW = Math.max((body.bounds.max.x - body.bounds.min.x) / 2, 2);
      const halfH = Math.max((body.bounds.max.y - body.bounds.min.y) / 2, 2);
      const minX = halfW;
      const maxX = width - halfW;
      const minY = halfH;
      const maxY = height - halfH;

      let { x, y } = body.position;
      let vx = body.velocity.x;
      let vy = body.velocity.y;
      let clamped = false;

      if (x < minX) {
        x = minX;
        vx = Math.abs(vx) * 0.2;
        clamped = true;
      } else if (x > maxX) {
        x = maxX;
        vx = -Math.abs(vx) * 0.2;
        clamped = true;
      }

      if (y < minY) {
        y = minY;
        vy = Math.abs(vy) * 0.2;
        clamped = true;
      } else if (y > maxY) {
        y = maxY;
        vy = -Math.abs(vy) * 0.15;
        clamped = true;
      }

      if (clamped) {
        Matter.Body.setPosition(body, { x, y });
        Matter.Body.setVelocity(body, { x: vx, y: vy });
      }
    });
  };

  const startPhysics = (width: number, height: number) => {
    clearPhysics();

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    });
    engineRef.current = engine;

    // Floor top edge sits exactly on the canvas bottom so letters rest
    // flush with the quote box edge.
    const thickness = 160;
    const walls = [
      Matter.Bodies.rectangle(
        width / 2,
        height + thickness / 2,
        width + thickness * 2,
        thickness,
        { isStatic: true, friction: 0.8, label: 'floor' }
      ),
      Matter.Bodies.rectangle(
        -thickness / 2,
        height / 2,
        thickness,
        height + thickness * 2,
        { isStatic: true, label: 'left-wall' }
      ),
      Matter.Bodies.rectangle(
        width + thickness / 2,
        height / 2,
        thickness,
        height + thickness * 2,
        { isStatic: true, label: 'right-wall' }
      ),
      Matter.Bodies.rectangle(
        width / 2,
        -thickness / 2,
        width + thickness * 2,
        thickness,
        { isStatic: true, label: 'ceiling' }
      ),
    ];

    const letterBodies: Matter.Body[] = [];
    lettersRef.current.forEach((letter) => {
      if (letter.char === ' ' || !letter.revealed) {
        letter.body = null;
        return;
      }

      // Tight boxes so siblings don't overlap and explode apart on spawn.
      const bodyWidth = Math.max(letter.width * 0.65, 5);
      const bodyHeight = Math.max(textSizeRef.current * 0.62, 8);
      const body = Matter.Bodies.rectangle(
        letter.x + letter.width / 2,
        letter.y + letter.height * 0.45,
        bodyWidth,
        bodyHeight,
        {
          isStatic: false,
          friction: 0.55,
          frictionAir: 0.035,
          restitution: 0.02,
          density: 0.002,
          label: letter.char,
        }
      );
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      letter.body = body;
      letterBodies.push(body);
    });

    Matter.World.add(engine.world, [...walls, ...letterBodies]);
    physicsEnabledRef.current = true;
  };

  const applyCursorForces = () => {
    if (!physicsEnabledRef.current) return;
    const { x: mx, y: my } = mousePosRef.current;
    if (mx < -1000 || my < -1000) return;

    lettersRef.current.forEach((letter) => {
      const body = letter.body;
      if (!body) return;

      const dx = body.position.x - mx;
      const dy = body.position.y - my;
      const dist = Math.hypot(dx, dy) || 0.001;
      if (dist > CURSOR_PUSH_RADIUS) return;

      const forceScale =
        CURSOR_PUSH_STRENGTH * (1 - dist / CURSOR_PUSH_RADIUS) * body.mass;
      Matter.Body.applyForce(body, body.position, {
        x: (dx / dist) * forceScale,
        y: (dy / dist) * forceScale,
      });
    });
  };

  const paintNextLetter = () => {
    if (monochromeRef.current || physicsEnabledRef.current) return;

    const nextLetter = getPaintTargets().find((letter) => !letter.painted);
    if (!nextLetter) return;

    nextLetter.color = nextLetter.targetColor;
    nextLetter.painted = true;
    nextLetter.revealed = true;
    paintedCountRef.current += 1;
    updateCursorAppearance();

    const targets = getPaintTargets();
    if (targets.length > 0 && targets.every((letter) => letter.painted)) {
      const { width, height } = canvasSizeRef.current;
      if (width > 0 && height > 0) {
        startPhysics(width, height);
      }
    }
  };

  const initializeLetters = (p5: p5Types) => {
    clearPhysics();
    maxWidthRef.current = p5.width * 0.7;
    canvasSizeRef.current = { width: p5.width, height: p5.height };

    let fontSize = p5.height * 0.3;
    let lines: string[] = [];
    let fitsVertically = false;

    while (fontSize > 10 && !fitsVertically) {
      p5.textSize(fontSize);
      lines = wrapText(p5, quote, maxWidthRef.current);

      const lineHeight = fontSize * 0.86;
      const totalHeight = lines.length * lineHeight;

      if (totalHeight <= p5.height) {
        fitsVertically = true;
      } else {
        fontSize -= 5;
      }
    }

    textSizeRef.current = fontSize;
    p5.textSize(fontSize);
    p5.textAlign(p5.LEFT, p5.TOP);

    const lineHeight = fontSize * 0.86;
    const totalHeight = lines.length * lineHeight;
    const startY = (p5.height - totalHeight) / 2;
    const startX = (p5.width - maxWidthRef.current) / 2;

    const letters: Letter[] = [];
    let sequenceIndex = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const lineWidth = p5.textWidth(line);
      const lineX = startX + (maxWidthRef.current - lineWidth) / 2;
      let cursorX = lineX;
      const cursorY = startY + lineIdx * lineHeight;

      for (const char of line) {
        const charWidth = p5.textWidth(char);
        let targetColor = COLORS.white;
        let isPaintTarget = false;
        let color = COLORS.white;

        if (monochromeRef.current) {
          targetColor = COLORS.white;
        } else if (isFullStopChar(char)) {
          // Full stop is part of the click sequence (yellow).
          targetColor = COLORS.yellow;
          isPaintTarget = true;
          color = COLORS.white;
        } else if (char !== ' ' && !isQuoteChar(char)) {
          targetColor =
            LETTER_COLOR_SEQUENCE[sequenceIndex % LETTER_COLOR_SEQUENCE.length];
          sequenceIndex += 1;
          // Skip whites in the sequence — stay white, not click-painted.
          isPaintTarget = targetColor !== COLORS.white;
          color = COLORS.white;
        }

        letters.push({
          char,
          x: cursorX,
          y: cursorY,
          width: charWidth,
          height: lineHeight,
          revealed: false,
          color,
          targetColor,
          isPaintTarget,
          painted: false,
          body: null,
        });

        cursorX += charWidth;
      }
    }

    lettersRef.current = letters;
    paintedCountRef.current = 0;
    updateCursorAppearance();
  };

  const wrapText = (p5: p5Types, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = p5.textWidth(testLine);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const preload = (p5: p5Types) => {
    fontRef.current = p5.loadFont(fontUrl) as unknown as p5Types.Font;
  };

  const measureStage = () => {
    const stage = containerRef.current;
    if (!stage) return { width: 0, height: 0 };
    const rect = stage.getBoundingClientRect();
    return {
      width: Math.max(0, Math.floor(rect.width)),
      height: Math.max(0, Math.floor(rect.height)),
    };
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const measured = measureStage();
    const parent = canvasParentRef as HTMLElement;
    const parentRect = parent.getBoundingClientRect();

    const width =
      measured.width ||
      (parentRect.width > 0 ? Math.floor(parentRect.width) : 800);
    const height =
      measured.height ||
      (parentRect.height > 0 ? Math.floor(parentRect.height) : 600);

    p5.createCanvas(width, height).parent(canvasParentRef);
    p5.textFont(fontRef.current ?? 'sans-serif');
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.noStroke();

    if (width > 0 && height > 0) {
      initializeLetters(p5);
      isInitializedRef.current = true;
    }

    lastRevealAtRef.current = p5.millis();
    revealedCountRef.current = 0;
  };

  const draw = (p5: p5Types) => {
    p5.background(BACKGROUND);

    if (!isInitializedRef.current && p5.width > 0 && p5.height > 0) {
      p5.textFont(fontRef.current ?? 'sans-serif');
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(textSizeRef.current);
      initializeLetters(p5);
      isInitializedRef.current = true;
      lastRevealAtRef.current = p5.millis();
    }

    if (!isInitializedRef.current) {
      return;
    }

    if (engineRef.current && physicsEnabledRef.current) {
      applyCursorForces();
      Matter.Engine.update(engineRef.current, 1000 / 60);
      containBodies(p5.width, p5.height);
    }

    p5.textFont(fontRef.current ?? 'sans-serif');
    p5.textSize(textSizeRef.current);

    const now = p5.millis();
    if (
      revealedCountRef.current < lettersRef.current.length &&
      now - lastRevealAtRef.current >= REVEAL_INTERVAL_MS
    ) {
      revealedCountRef.current += 1;
      lastRevealAtRef.current = now;
    }

    lettersRef.current.forEach((letter, index) => {
      if (index < revealedCountRef.current) {
        letter.revealed = true;
      }

      if (!letter.revealed) return;

      p5.push();
      // Keep whatever colour the letter had when gravity started.
      p5.fill(letter.color);

      if (letter.body && physicsEnabledRef.current) {
        const { x, y } = letter.body.position;
        p5.translate(x, y);
        p5.rotate(letter.body.angle);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(letter.char, 0, 0);
      } else {
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(letter.char, letter.x, letter.y);
      }

      p5.pop();
    });
  };

  const windowResized = (p5: p5Types) => {
    const { width, height } = measureStage();
    if (width > 0 && height > 0) {
      p5.resizeCanvas(width, height);
      initializeLetters(p5);
      isInitializedRef.current = true;
      revealedCountRef.current = Math.min(
        revealedCountRef.current,
        lettersRef.current.length
      );
    }
  };

  useEffect(() => {
    const stage = containerRef.current;
    if (!stage || monochrome) return;

    const observer = new ResizeObserver(() => {
      // Trigger p5's windowResized via a synthetic resize when the
      // quote stage changes size (zoom / fullscreen / layout).
      window.dispatchEvent(new Event('resize'));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [monochrome]);

  useEffect(() => {
    if (monochrome) return;

    const cursor = document.createElement('div');
    cursorRef.current = cursor;
    cursor.style.width = `${CURSOR_SIZE}px`;
    cursor.style.height = `${CURSOR_SIZE}px`;
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = getNextPaintColor();
    cursor.style.position = 'fixed';
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.opacity = '0';
    cursor.style.transition =
      'width 200ms ease, height 200ms ease, background-color 150ms ease, opacity 120ms ease';
    document.body.appendChild(cursor);

    return () => {
      if (cursor.parentNode) {
        document.body.removeChild(cursor);
      }
      cursorRef.current = null;
    };
  }, [monochrome]);

  useEffect(() => {
    return () => {
      clearPhysics();
    };
  }, []);

  const toLocalPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseEnter = () => {
    if (monochrome) return;
    isHoveringRef.current = true;
    updateCursorAppearance();
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    isMouseDownRef.current = false;
    mousePosRef.current = { x: -9999, y: -9999 };
    updateCursorAppearance();
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (monochrome) return;

    mousePosRef.current = toLocalPoint(event.clientX, event.clientY);

    const cursor = cursorRef.current;
    if (cursor) {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (monochrome) return;
    isMouseDownRef.current = true;
    mousePosRef.current = toLocalPoint(event.clientX, event.clientY);
    updateCursorAppearance();
    paintNextLetter();
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    updateCursorAppearance();
  };

  return (
    // Pointer-driven canvas surface; keyboard N/A for color/physics interaction.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <QuoteStage
      ref={containerRef}
      $monochrome={monochrome}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Sketch
        preload={preload}
        setup={setup}
        draw={draw}
        windowResized={windowResized}
      />
    </QuoteStage>
  );
};
