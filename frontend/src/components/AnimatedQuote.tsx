import { useRef } from 'react';
import Sketch from 'react-p5';
import type p5Types from 'p5';

type AnimatedQuoteProps = {
  quote: string;
};

type Letter = {
  char: string;
  x: number;
  y: number;
  revealed: boolean;
  color: string;
};

const REVEAL_INTERVAL_MS = 50;

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

export const AnimatedQuote = ({ quote }: AnimatedQuoteProps) => {
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

  const initializeLetters = (p5: p5Types) => {
    maxWidthRef.current = p5.width * 0.7;

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
    let letterIndex = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const lineWidth = p5.textWidth(line);
      const lineX = startX + (maxWidthRef.current - lineWidth) / 2;
      let cursorX = lineX;
      const cursorY = startY + lineIdx * lineHeight;

      for (const char of line) {
        const charWidth = p5.textWidth(char);
        let color: string;

        if (
          char === '“' ||
          char === '”' ||
          char === '"' ||
          char === '"' ||
          char === '"'
        ) {
          color = COLORS.white;
        } else if (char === '.' || char === '!' || char === '?') {
          color = COLORS.yellow;
        } else if (char === ' ') {
          color = COLORS.white;
        } else {
          color =
            LETTER_COLOR_SEQUENCE[letterIndex % LETTER_COLOR_SEQUENCE.length];
          letterIndex++;
        }

        letters.push({
          char,
          x: cursorX,
          y: cursorY,
          revealed: false,
          color,
        });

        cursorX += charWidth;
      }
    }

    lettersRef.current = letters;
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

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const parent = canvasParentRef as HTMLElement;
    const rect = parent.getBoundingClientRect();

    const width = rect.width > 0 ? rect.width : 800;
    const height = rect.height > 0 ? rect.height : 600;

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

    p5.textFont(fontRef.current ?? 'sans-serif');
    p5.textAlign(p5.LEFT, p5.TOP);
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

      if (letter.revealed) {
        p5.push();
        p5.fill(letter.color);
        p5.text(letter.char, letter.x, letter.y);
        p5.pop();
      }
    });
  };

  const windowResized = (p5: p5Types) => {
    const parent = containerRef.current;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        p5.resizeCanvas(rect.width, rect.height);
        initializeLetters(p5);
        isInitializedRef.current = true;
        revealedCountRef.current = Math.min(
          revealedCountRef.current,
          lettersRef.current.length
        );
      }
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
      }}
    >
      <Sketch
        preload={preload}
        setup={setup}
        draw={draw}
        windowResized={windowResized}
      />
    </div>
  );
};
