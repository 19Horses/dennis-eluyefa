import { useMemo, useRef } from 'react';
import Sketch from 'react-p5';
import type p5Types from 'p5';
import usePreloadQueries from '../queries/usePreloadQueries';

type SplashScreenProps = {
  onComplete: () => void;
};

type Letter = {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  colorIndex: number;
};

const TEXT = 'dennis eluyefa';
const REVEAL_INTERVAL_MS = 100;
const COLORS = ['#FFFFFF', '#F000B6', '#00E5FF', '#FFB800', '#9B5DE5'];
const BACKGROUND = '#000000';

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  usePreloadQueries()

  const fontUrl = useMemo(
    () => new URL('../assets/HelveticaNeue-Bold.otf', import.meta.url).href,
    []
  );
  const fontRef = useRef<p5Types.Font | null>(null);
  const lettersRef = useRef<Letter[]>([]);
  const textSizeRef = useRef<number>(64);
  const lastRevealAtRef = useRef<number>(0);
  const revealedCountRef = useRef<number>(0);
  const droppingRef = useRef<boolean>(false);
  const doneRef = useRef<boolean>(false);

  const initializeLetters = (p5: p5Types) => {
    const size = Math.max(32, Math.min(p5.width * 0.08, 96));
    textSizeRef.current = size;
    p5.textSize(size);
    p5.textAlign(p5.LEFT, p5.CENTER);

    let totalWidth = 0;
    for (const char of TEXT) {
      totalWidth += p5.textWidth(char);
    }

    const startX = (p5.width - totalWidth) / 2;
    const centerY = p5.height / 2;
    let cursorX = startX;

    const letters: Letter[] = [];
    for (const char of TEXT) {
      const charWidth = p5.textWidth(char);
      if (char === ' ') {
        cursorX += charWidth;
        continue;
      }
      letters.push({
        char,
        x: cursorX + charWidth / 2,
        y: centerY,
        vx: 0,
        vy: 0,
        rotation: 0,
        rotationSpeed: 0,
        gravity: 0,
        colorIndex: Math.floor(p5.random(COLORS.length)),
      });
      cursorX += charWidth;
    }

    lettersRef.current = letters;
  };

  const startDrop = (p5: p5Types) => {
    lettersRef.current = lettersRef.current.map((letter) => ({
      ...letter,
      vx: p5.random(-1.5, 1.5),
      vy: p5.random(-3, 0),
      rotation: p5.random(-0.4, 0.4),
      rotationSpeed: p5.random(-0.08, 0.08),
      gravity: p5.random(0.2, 0.6),
    }));
    droppingRef.current = true;
  };

  const preload = (p5: p5Types) => {
    fontRef.current = p5.loadFont(fontUrl) as unknown as p5Types.Font;
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.textFont(fontRef.current ?? 'sans-serif');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.noStroke();

    initializeLetters(p5);
    lastRevealAtRef.current = p5.millis();
    revealedCountRef.current = 0;
  };

  const draw = (p5: p5Types) => {
    p5.background(BACKGROUND);
    p5.textFont(fontRef.current ?? 'sans-serif');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(textSizeRef.current);

    if (!droppingRef.current) {
      const now = p5.millis();
      if (
        revealedCountRef.current < lettersRef.current.length &&
        now - lastRevealAtRef.current >= REVEAL_INTERVAL_MS
      ) {
        revealedCountRef.current += 1;
        lastRevealAtRef.current = now;
      }
      if (revealedCountRef.current >= lettersRef.current.length) {
        startDrop(p5);
      }
    }

    let allOffscreen = true;
    lettersRef.current = lettersRef.current.map((letter, index) => {
      if (droppingRef.current) {
        letter.vy += letter.gravity;
        letter.x += letter.vx;
        letter.y += letter.vy;
        letter.rotation += letter.rotationSpeed;
      }

      const beyondBottom =
        letter.y - textSizeRef.current > p5.height + textSizeRef.current;
      allOffscreen = allOffscreen && beyondBottom;

      if (index < revealedCountRef.current) {
        p5.push();
        p5.translate(letter.x, letter.y);
        p5.rotate(letter.rotation);
        p5.fill(COLORS[letter.colorIndex]);
        p5.text(letter.char, 0, 0);
        p5.pop();
      }

      return letter;
    });

    if (droppingRef.current && allOffscreen && !doneRef.current) {
      doneRef.current = true;
      p5.noLoop();
      onComplete();
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    if (!droppingRef.current) {
      initializeLetters(p5);
      revealedCountRef.current = Math.min(
        revealedCountRef.current,
        lettersRef.current.length
      );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: BACKGROUND,
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
