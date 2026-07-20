'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type MotionPreset = 'slide' | 'spin' | 'pop';
type Duration = '300' | '600' | '1000';
type Easing = 'ease-out' | 'ease-in-out' | 'linear';
type Delay = '0' | '150' | '300';
type Origin = 'center' | 'top-left' | 'bottom-right';

const presetClasses: Readonly<Record<MotionPreset, string>> = {
  slide: 'translate-x-20 -rotate-3',
  spin: 'rotate-180 scale-75',
  pop: '-translate-y-10 scale-125 rotate-6',
};

const durationClasses: Readonly<Record<Duration, string>> = {
  '300': 'duration-300',
  '600': 'duration-[600ms]',
  '1000': 'duration-1000',
};

const easingClasses: Readonly<Record<Easing, string>> = {
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  linear: 'ease-linear',
};

const delayClasses: Readonly<Record<Delay, string>> = {
  '0': 'delay-0',
  '150': 'delay-150',
  '300': 'delay-300',
};

const originClasses: Readonly<Record<Origin, string>> = {
  center: 'origin-center',
  'top-left': 'origin-top-left',
  'bottom-right': 'origin-bottom-right',
};

const originMarkerClasses: Readonly<Record<Origin, string>> = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-left': 'top-2 left-2',
  'bottom-right': 'right-2 bottom-2',
};

const recipes = [
  {
    number: '01',
    title: 'Lift on hover',
    copy: 'Move, shadow, and color all share one transition.',
    className:
      'hover:-translate-y-2 hover:shadow-[8px_8px_0_#171b18] hover:bg-[#d8ff52]',
    demo: 'LIFT',
  },
  {
    number: '02',
    title: 'Reveal the action',
    copy: 'A group lets children respond to the parent hover state.',
    className:
      'group-hover:translate-x-0 group-hover:opacity-100 group-hover:bg-[#ff6240]',
    demo: 'REVEAL →',
  },
  {
    number: '03',
    title: 'Focus with intent',
    copy: 'Keyboard focus deserves motion and contrast too.',
    className:
      'focus-visible:scale-[1.03] focus-visible:ring-4 focus-visible:ring-[#8b7cff]',
    demo: 'TAB TO ME',
  },
] as const;

const staggerItems = ['Structure', 'State', 'Motion', 'Polish'] as const;

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: Readonly<{
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}>) {
  return (
    <label className="grid gap-2 text-[0.68rem] font-black tracking-[0.14em] uppercase">
      {label}
      <select
        className="h-12 cursor-pointer rounded-none border border-[#171b18] bg-[#fffdf7] px-3 text-sm font-bold tracking-normal normal-case"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Reveal({
  children,
  delay = 0,
}: Readonly<{ children: ReactNode; delay?: number }>) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (typeof globalThis.IntersectionObserver === 'undefined') {
      const fallbackTimer = globalThis.setTimeout(() => setIsVisible(true), 0);
      return () => globalThis.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function MotionSpringLab() {
  const shouldReduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);

  return (
    <section className="grid border-b border-[#171b18] lg:grid-cols-[0.78fr_1.22fr]">
      <div className="bg-[#ff6240] px-[4vw] py-20 lg:py-28">
        <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
          Motion / Spring / Drag
        </p>
        <h2 className="max-w-[8ch] text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-black tracking-[-0.07em]">
          Physics, not just timing.
        </h2>
        <p className="mt-8 max-w-md leading-7 text-[#512319]">
          Motion adds spring physics, gestures, and orchestration. Drag the
          card, or replay its spring entrance.
        </p>
        <button
          className="mt-8 min-h-12 border border-[#171b18] bg-[#171b18] px-5 text-xs font-black tracking-widest text-white uppercase transition-colors hover:bg-[#8b7cff]"
          type="button"
          onClick={() => setRun((current) => current + 1)}
        >
          Replay spring
        </button>
      </div>

      <div className="grid min-h-[34rem] place-items-center overflow-hidden bg-[#f3f0e8] p-8">
        <div className="relative grid h-72 w-full max-w-xl place-items-center border border-dashed border-[#171b18]/40">
          <span className="absolute top-4 left-4 font-mono text-[0.62rem] font-black tracking-widest uppercase">
            drag=&quot;x&quot; · type=&quot;spring&quot;
          </span>
          <motion.div
            key={run}
            drag={shouldReduceMotion ? false : 'x'}
            dragConstraints={{ left: -110, right: 110 }}
            dragElastic={0.15}
            initial={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.7, y: 48 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 210, damping: 16, mass: 0.8 }
            }
            whileDrag={
              shouldReduceMotion ? undefined : { scale: 1.06, rotate: 3 }
            }
            className="grid h-40 w-40 cursor-grab place-items-center border border-[#171b18] bg-[#8b7cff] text-center shadow-[12px_12px_0_#171b18] active:cursor-grabbing"
          >
            <strong className="font-mono text-xs tracking-widest uppercase">
              Drag me
              <br />← →
            </strong>
          </motion.div>
        </div>
        <code className="mt-6 max-w-xl text-center text-xs leading-6 text-[#6558d7]">
          useReducedMotion() ? &#123; duration: 0 &#125; : &#123; type:
          &apos;spring&apos;, stiffness: 210, damping: 16 &#125;
        </code>
      </div>
    </section>
  );
}

function ScrollLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = parallaxRef.current;
    if (!section || !layer) return;

    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion?.matches) {
        layer.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      const rect = section.getBoundingClientRect();
      const distance = window.innerHeight + rect.height;
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / distance),
      );
      const offset = (progress - 0.5) * -180;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion?.addEventListener('change', scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion?.removeEventListener('change', scheduleUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[185vh] overflow-clip border-b border-[#171b18] bg-[#171b18]"
      data-scroll-lab
      id="scroll-lab"
    >
      <div className="sticky top-[68px] z-20 grid min-h-[calc(100vh-68px)] overflow-hidden text-white lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative z-20 flex flex-col justify-center bg-[#171b18]/92 px-[4vw] py-16 backdrop-blur-sm">
          <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] text-[#d8ff52] uppercase">
            Scroll-linked / Parallax
          </p>
          <h2 className="max-w-[8ch] text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-black tracking-[-0.07em]">
            Scroll becomes the timeline.
          </h2>
          <p className="mt-8 max-w-md leading-7 text-white/65">
            This stage stays sticky while its layers move at different rates.
            Overflow clips the scene; z-index keeps the lesson readable.
          </p>
          <code className="mt-7 max-w-md border-l-4 border-[#8b7cff] pl-4 text-xs leading-6 text-[#bcb5ff]">
            sticky top-[68px] z-20 overflow-hidden
            <br />
            view-timeline-name: --scroll-lab
          </code>
        </div>

        <div className="relative z-10 min-h-[32rem] overflow-hidden bg-[#242a26]">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:52px_52px]" />
          <div
            ref={parallaxRef}
            className="absolute inset-x-[10%] top-[16%] grid gap-6 will-change-transform motion-reduce:transform-none"
          >
            <div className="h-36 translate-x-[12%] border border-[#171b18] bg-[#8b7cff] shadow-[12px_12px_0_#d8ff52]" />
            <div className="ml-auto h-28 w-2/3 -translate-x-[8%] border border-white/30 bg-[#ff6240]" />
            <div className="h-20 w-1/2 translate-x-[34%] border border-white/30 bg-[#fffdf7]" />
          </div>
          <div className="absolute right-7 bottom-7 left-7 z-30 h-2 overflow-hidden border border-white/40 bg-[#171b18]">
            <span className="block h-full bg-[#d8ff52]" data-scroll-progress />
          </div>
          <span className="absolute right-7 bottom-13 z-30 font-mono text-[0.62rem] font-black tracking-widest text-white/60 uppercase">
            CSS view timeline
          </span>
        </div>
      </div>
    </section>
  );
}

export function MotionPracticePage() {
  const [preset, setPreset] = useState<MotionPreset>('slide');
  const [duration, setDuration] = useState<Duration>('600');
  const [easing, setEasing] = useState<Easing>('ease-out');
  const [delay, setDelay] = useState<Delay>('0');
  const [origin, setOrigin] = useState<Origin>('center');
  const [isActive, setIsActive] = useState(false);
  const [staggerRun, setStaggerRun] = useState(0);

  const composedClass = `transition-[transform,opacity] ${durationClasses[duration]} ${easingClasses[easing]} ${delayClasses[delay]} ${originClasses[origin]} ${isActive ? `${presetClasses[preset]} opacity-70` : 'translate-x-0 rotate-0 scale-100 opacity-100'}`;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f3f0e8] text-[#171b18]">
      <header className="sticky top-0 z-50 flex min-h-[68px] items-center justify-between border-b border-[#171b18] bg-[#f3f0e8]/90 px-[4vw] backdrop-blur-xl">
        <Link
          className="text-sm font-black tracking-[-0.03em] no-underline"
          href="/"
          aria-label="On T React Lab home"
        >
          ON T{' '}
          <span className="font-semibold text-[#687069]">/ MOTION LAB</span>
        </Link>
        <nav
          className="flex items-center gap-5 text-[0.7rem] font-black tracking-[0.08em] uppercase sm:gap-8"
          aria-label="Motion practice sections"
        >
          <a
            className="hidden underline-offset-4 hover:underline sm:block"
            href="#playground"
          >
            Playground
          </a>
          <a
            className="hidden underline-offset-4 hover:underline sm:block"
            href="#reveal"
          >
            Reveal
          </a>
          <a
            className="hidden underline-offset-4 hover:underline md:block"
            href="#scroll-lab"
          >
            Scroll lab
          </a>
          <Link className="underline-offset-4 hover:underline" href="/web3">
            Web3 lab
          </Link>
        </nav>
      </header>

      <section className="relative grid min-h-[calc(100vh-68px)] border-b border-[#171b18] lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative z-10 flex flex-col items-start justify-center bg-[#8b7cff] px-[4vw] py-20 lg:py-28">
          <p className="mb-6 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
            Tailwind CSS · Practice 003
          </p>
          <h1 className="max-w-[8ch] text-[clamp(4rem,10vw,10rem)] leading-[0.82] font-black tracking-[-0.085em]">
            Make it move.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed font-medium md:text-xl">
            Compose utilities, keyframes, observers, and scroll timelines. Tune
            each layer of motion and see the code behind the result.
          </p>
          <a
            className="mt-8 inline-flex min-h-13 min-w-60 items-center justify-between bg-[#171b18] px-4 text-xs font-black tracking-[0.08em] text-[#fffdf7] uppercase transition-all duration-300 hover:min-w-68 hover:bg-[#ff6240] focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
            href="#playground"
          >
            Open playground <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="relative grid min-h-[34rem] place-items-center overflow-hidden bg-[#171b18] p-10 text-[#fffdf7]">
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative grid h-72 w-72 place-items-center rounded-full border border-[#f3f0e8]/35">
            <div className="absolute inset-5 animate-orbit rounded-full border border-dashed border-[#d8ff52]/60 motion-reduce:animate-none">
              <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#d8ff52] shadow-[0_0_24px_#d8ff52]" />
            </div>
            <div className="relative animate-drift border border-[#171b18] bg-[#fffdf7] p-8 text-[#171b18] shadow-[12px_12px_0_#ff6240] motion-reduce:animate-none">
              <span className="font-mono text-[0.65rem] font-black tracking-widest text-[#7163e8]">
                TRANSFORM
              </span>
              <strong className="mt-2 block text-5xl tracking-[-0.07em]">
                0 → 1
              </strong>
            </div>
          </div>
          <div className="absolute right-6 bottom-6 left-6 h-px overflow-hidden bg-white/20">
            <span className="block h-full w-1/4 animate-scan bg-[#d8ff52] motion-reduce:animate-none" />
          </div>
        </div>
      </section>

      <section
        className="grid border-b border-[#171b18] bg-[#fffdf7] sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Motion lab syllabus"
      >
        {[
          ['01', 'Timing', 'transition · duration · easing · delay'],
          ['02', 'Change', 'transform · opacity · transform-origin'],
          ['03', 'Trigger', '@keyframes · Intersection Observer · reveal'],
          ['04', 'Scroll', 'sticky · overflow · z-index · parallax'],
        ].map(([number, title, topics]) => (
          <div
            className="min-h-36 border-b border-[#171b18] p-6 sm:odd:border-r lg:border-r lg:border-b-0 lg:last:border-r-0"
            key={number}
          >
            <span className="font-mono text-xs font-black text-[#ff6240]">
              {number}
            </span>
            <strong className="mt-6 block text-xl tracking-[-0.04em]">
              {title}
            </strong>
            <p className="mt-2 font-mono text-[0.65rem] leading-5 text-[#5c645e]">
              {topics}
            </p>
          </div>
        ))}
      </section>

      <section
        className="scroll-mt-[68px] border-b border-[#171b18] px-[4vw] py-20 lg:py-32"
        id="playground"
      >
        <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1fr_0.6fr]">
          <div>
            <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
              Utility composer
            </p>
            <h2 className="max-w-[10ch] text-[clamp(3rem,7vw,7rem)] leading-[0.9] font-black tracking-[-0.07em]">
              Change the class. Feel the difference.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#5c645e]">
            Choose a transform, duration, easing curve, delay, and origin. The
            preview and class string update together, so every visual change
            maps back to code.
          </p>
        </div>

        <div className="grid border border-[#171b18] bg-[#171b18] lg:grid-cols-[0.72fr_1.28fr] lg:gap-px">
          <div className="grid content-start gap-6 bg-[#fffdf7] p-6 md:p-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SelectField
                label="Transform"
                value={preset}
                options={['slide', 'spin', 'pop']}
                onChange={(nextPreset) => {
                  setIsActive(false);
                  setPreset(nextPreset);
                }}
              />
              <SelectField
                label="Duration"
                value={duration}
                options={['300', '600', '1000']}
                onChange={setDuration}
              />
              <SelectField
                label="Easing"
                value={easing}
                options={['ease-out', 'ease-in-out', 'linear']}
                onChange={setEasing}
              />
              <SelectField
                label="Delay (ms)"
                value={delay}
                options={['0', '150', '300']}
                onChange={setDelay}
              />
              <SelectField
                label="Transform origin"
                value={origin}
                options={['center', 'top-left', 'bottom-right']}
                onChange={setOrigin}
              />
            </div>

            <button
              className="mt-2 min-h-13 border border-[#171b18] bg-[#d8ff52] px-5 text-xs font-black tracking-[0.1em] uppercase transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_#171b18] active:translate-y-0 active:shadow-none"
              type="button"
              onClick={() => setIsActive((current) => !current)}
            >
              {isActive ? 'Reset motion' : 'Run motion'}
            </button>

            <div className="mt-2 border-l-4 border-[#8b7cff] bg-[#efede6] p-4">
              <span className="font-mono text-[0.62rem] font-black tracking-widest uppercase">
                Live class string
              </span>
              <code className="mt-2 block text-xs leading-6 break-words text-[#6558d7]">
                {composedClass}
              </code>
            </div>
          </div>

          <div className="relative grid min-h-[32rem] place-items-center overflow-hidden bg-[#242a26] p-8">
            <span className="absolute top-5 left-5 font-mono text-[0.62rem] font-bold tracking-widest text-white/50 uppercase">
              Preview / click run
            </span>
            <div
              className={`relative grid h-40 w-40 place-items-center border border-[#171b18] bg-[#ff6240] shadow-[14px_14px_0_#d8ff52] motion-reduce:transition-none ${composedClass}`}
              aria-live="polite"
            >
              <span
                className={`absolute h-3 w-3 rounded-full border border-[#fffdf7] bg-[#171b18] ${originMarkerClasses[origin]}`}
                aria-hidden="true"
              />
              <span className="text-center font-mono text-xs font-black tracking-widest uppercase">
                {preset}
                <br />
                {duration}ms · {origin}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-[68px] border-b border-[#171b18] bg-[#dedbd2] px-[4vw] py-20 lg:py-32"
        id="recipes"
      >
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
              Three recipes
            </p>
            <h2 className="text-[clamp(3rem,6vw,6rem)] leading-none font-black tracking-[-0.07em]">
              Hover. Focus. Notice.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5c645e]">
            Hover each card, then press Tab. Motion should clarify the
            action—not compete with it.
          </p>
        </div>

        <div className="grid gap-px border border-[#171b18] bg-[#171b18] md:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              className="group flex min-h-[27rem] flex-col bg-[#fffdf7] p-6 md:p-8"
              key={recipe.number}
            >
              <span className="font-mono text-xs font-black text-[#ff6240]">
                {recipe.number}
              </span>
              <h3 className="mt-8 text-3xl font-black tracking-[-0.05em]">
                {recipe.title}
              </h3>
              <p className="mt-3 leading-6 text-[#5c645e]">{recipe.copy}</p>
              <code className="mt-5 text-[0.68rem] leading-5 break-words text-[#6558d7]">
                {recipe.className}
              </code>
              <button
                className={`mt-auto min-h-24 border border-[#171b18] bg-[#f3f0e8] text-xs font-black tracking-[0.1em] transition-all duration-300 ${
                  recipe.number === '01'
                    ? 'hover:-translate-y-2 hover:bg-[#d8ff52] hover:shadow-[8px_8px_0_#171b18]'
                    : recipe.number === '02'
                      ? 'translate-x-3 opacity-70 group-hover:translate-x-0 group-hover:bg-[#ff6240] group-hover:opacity-100'
                      : 'focus-visible:scale-[1.03] focus-visible:ring-4 focus-visible:ring-[#8b7cff] focus-visible:outline-none'
                }`}
                type="button"
              >
                {recipe.demo}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section
        className="scroll-mt-[68px] border-b border-[#171b18] bg-[#fffdf7] px-[4vw] py-24 lg:py-36"
        id="reveal"
      >
        <div className="mb-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
              Intersection Observer / Scroll reveal
            </p>
            <h2 className="max-w-[9ch] text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-black tracking-[-0.07em]">
              Enter the viewport. Change the state.
            </h2>
          </div>
          <div className="self-end">
            <p className="max-w-xl leading-7 text-[#5c645e]">
              Each lesson below is observed once. When 15% enters the viewport,
              React changes its opacity and transform utilities, then stops
              observing.
            </p>
            <code className="mt-5 block max-w-xl border-l-4 border-[#ff6240] bg-[#f3f0e8] p-4 text-xs leading-6 text-[#6558d7]">
              new IntersectionObserver(callback, &#123; threshold: 0.15,
              rootMargin: &apos;0px 0px -12%&apos; &#125;)
            </code>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Observe', 'Attach one observer to the element with a ref.'],
            [
              'Reveal',
              'Swap opacity-0 / translate-y-10 for their visible state.',
            ],
            [
              'Disconnect',
              'Unobserve after entry when the reveal only runs once.',
            ],
          ].map(([title, description], index) => (
            <Reveal delay={index * 120} key={title}>
              <article className="min-h-64 border border-[#171b18] bg-[#f3f0e8] p-7 shadow-[8px_8px_0_#8b7cff]">
                <span className="font-mono text-xs font-black text-[#ff6240]">
                  0{index + 1}
                </span>
                <h3 className="mt-14 text-3xl font-black tracking-[-0.05em]">
                  {title}
                </h3>
                <p className="mt-3 leading-6 text-[#5c645e]">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid border-b border-[#171b18] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-[#d8ff52] px-[4vw] py-20 lg:py-28">
          <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
            @keyframes / Delay / Stagger
          </p>
          <h2 className="max-w-[8ch] text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-black tracking-[-0.07em]">
            One rhythm, four beats.
          </h2>
          <p className="mt-8 max-w-md leading-7 text-[#4f574f]">
            A named keyframe defines the change; per-item delay turns one motion
            into a readable sequence.
          </p>
          <code className="mt-6 block max-w-md border-l-4 border-[#8b7cff] pl-4 text-xs leading-6 text-[#485020]">
            @keyframes slide-in &#123;
            <br />
            &nbsp;from &#123; opacity: 0; transform: translateY(18px) &#125;
            <br />
            &nbsp;to &#123; opacity: 1; transform: translateY(0) &#125;
            <br />
            &#125;
          </code>
          <button
            className="mt-8 min-h-12 border border-[#171b18] bg-[#171b18] px-5 text-xs font-black tracking-widest text-white uppercase transition-colors hover:bg-[#ff6240]"
            type="button"
            onClick={() => setStaggerRun((run) => run + 1)}
          >
            Replay sequence
          </button>
        </div>
        <div className="flex min-h-[34rem] items-center bg-[#171b18] p-6 md:p-12">
          <ol className="grid w-full gap-3" key={staggerRun}>
            {staggerItems.map((item, index) => (
              <li
                className="animate-[slide-in_500ms_ease-out_both] border border-white/25 bg-[#242a26] p-5 text-white motion-reduce:animate-none"
                key={item}
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <span className="mr-5 font-mono text-xs text-[#8b7cff]">
                  0{index + 1}
                </span>
                <strong className="text-xl tracking-[-0.03em]">{item}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MotionSpringLab />
      <ScrollLab />

      <section className="grid gap-10 px-[4vw] py-20 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <div>
          <p className="mb-4 font-mono text-[0.7rem] font-black tracking-[0.16em] uppercase">
            Motion checklist
          </p>
          <h2 className="max-w-[9ch] text-[clamp(2.7rem,5vw,5rem)] leading-[0.93] font-black tracking-[-0.065em]">
            Before you call it done.
          </h2>
        </div>
        <ul className="m-0 border-t border-[#171b18] p-0">
          {[
            [
              'Transform first',
              'Opacity and transform usually animate smoothly.',
            ],
            ['Keep it brief', '150–500ms covers most interface feedback.'],
            [
              'Respect the user',
              'motion-reduce:* turns decoration off safely.',
            ],
            [
              'Explain a change',
              'Motion should show cause, direction, or hierarchy.',
            ],
          ].map(([title, description], index) => (
            <li
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#171b18] py-5"
              key={title}
            >
              <span className="font-mono text-xs font-black text-[#ff6240]">
                0{index + 1}
              </span>
              <div>
                <strong className="text-lg">{title}</strong>
                <p className="mt-1 text-sm leading-6 text-[#5c645e]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="flex min-h-40 flex-col items-start justify-between gap-6 bg-[#8b7cff] px-[4vw] py-10 sm:flex-row sm:items-center">
        <div>
          <strong className="text-sm font-black">ON T / MOTION LAB</strong>
          <p className="mt-2 text-sm text-[#2e2a55]">
            Compose it. Trigger it. Tune the timing. Remove what does not help.
          </p>
        </div>
        <div className="flex gap-5 text-xs font-black uppercase">
          <Link className="underline underline-offset-4" href="/">
            React lab
          </Link>
          <Link className="underline underline-offset-4" href="/web3">
            Web3 lab
          </Link>
        </div>
      </footer>
    </main>
  );
}
