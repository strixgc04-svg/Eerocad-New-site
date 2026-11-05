/**
 * Scroll and entrance motion.
 *
 * Rules this file enforces (docs/build-plan.md §4):
 *   - Only transform / opacity / filter animate. Nothing triggers layout,
 *     so none of this can cause CLS.
 *   - Content is revealed, never created, by JS. The HTML is complete without
 *     it, and `.no-js` shows everything.
 *   - The hero uses gsap.from(), so the heading is painted in its final state
 *     first and GSAP applies the start state afterwards. That keeps the LCP
 *     candidate on the first paint instead of waiting out the animation.
 *   - Everything is inside gsap.matchMedia(), so prefers-reduced-motion gets
 *     a complete static page rather than a broken one.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const mm = gsap.matchMedia();
const EASE = 'power3.out';

const MOTION = {
  ok: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
};

/* ----------------------------------------------------------------- intro */

/*
 * The curtain itself is pure CSS, so it always clears even if this never runs.
 * This only drives the count-up, which is decorative.
 */
{
  const count = document.querySelector<HTMLElement>('[data-intro-count]');
  if (count && document.documentElement.classList.contains('intro-active')) {
    const n = { v: 0 };
    gsap.to(n, {
      v: 100,
      duration: 0.85,
      ease: 'power2.out',
      onUpdate: () => {
        count.textContent = String(Math.round(n.v));
      },
    });
  }
}

/* ------------------------------------------------------------- hero entrance */

mm.add(MOTION.ok, () => {
  const heading = document.querySelector<HTMLElement>('[data-hero-heading]');
  const items = gsap.utils.toArray<HTMLElement>('[data-hero-item]');
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  let split: SplitText | undefined;

  if (heading) {
    // SplitText (free since April 2025) wraps each line in its own mask, so
    // the heading keeps its exact layout box while the lines slide up.
    split = new SplitText(heading, { type: 'lines', mask: 'lines' });
    tl.from(split.lines, { yPercent: 115, duration: 0.85, stagger: 0.09 });
  }

  if (items.length) {
    tl.from(items, { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.2);
  }

  /*
   * Safety net, and it is not optional.
   *
   * Between SplitText creating the masks and the timeline finishing, the
   * headline is hidden. If rAF is throttled - a backgrounded tab, a stalled
   * main thread, a device under load - it would stay hidden, which is the
   * exact failure this rebuild exists to fix.
   *
   * So: snap to the end if the page is hidden, and hard-stop after 2.5s
   * whatever happened. A missed animation is fine; invisible copy is not.
   */
  const finish = () => {
    if (tl.progress() < 1) tl.progress(1);
  };
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') finish();
  };

  document.addEventListener('visibilitychange', onVisibility);
  const guard = window.setTimeout(finish, 2500);

  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    window.clearTimeout(guard);
    tl.kill();
    split?.revert();
  };
});

/* ------------------------------------------------------------------ reveals */

mm.add(
  { motionOk: MOTION.ok, motionReduced: MOTION.reduced },
  (context) => {
    const { motionOk } = context.conditions as { motionOk: boolean };
    const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');

    if (!motionOk) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    targets.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-revealed'),
      });
    });

    requestAnimationFrame(() => {
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add('is-revealed');
        }
      });
    });
  },
);

/* ------------------------------------------------------- staggered groups */

/*
 * Wide viewports: items sit side by side in a grid, so the whole group is
 * visible at once and a single staggered reveal reads as one gesture.
 */
mm.add(`${MOTION.ok} and (min-width: 640px)`, () => {
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;

    gsap.from(items, {
      y: 28,
      opacity: 0,
      duration: 0.7,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 82%', once: true },
    });
  });
});

/*
 * Phones: the same group is a tall single column, so a group-level trigger
 * would animate every item the moment the FIRST one entered — items three
 * and four would finish long before you scrolled to them, and arrive
 * already static.
 *
 * So each item gets its own trigger, and a little more character than the
 * desktop version: it lifts and scales up fractionally as it enters.
 */
mm.add(`${MOTION.ok} and (max-width: 639px)`, () => {
  gsap.utils.toArray<HTMLElement>('[data-stagger-item]').forEach((item) => {
    gsap.from(item, {
      y: 40,
      scale: 0.965,
      opacity: 0,
      duration: 0.75,
      ease: EASE,
      scrollTrigger: { trigger: item, start: 'top 90%', once: true },
    });
  });
});

/* ------------------------------------------------ process rail progress */

/*
 * Every rail on the page, not the first one. This was a single
 * querySelector, which was true while only the home page had a rail; the
 * service pages draw their process the same way, and the second rail would
 * have sat at scaleY(0) for the life of the page.
 */
mm.add(MOTION.ok, () => {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((rail) => {
    const progress = rail.querySelector<HTMLElement>('[data-rail-progress]');
    if (!progress) return;

    gsap.set(progress, { height: '100%' });

    gsap.fromTo(
      progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top 70%',
          end: 'bottom 75%',
          scrub: 0.6,
        },
      },
    );
  });
});

/* ------------------------------------------------------------- parallax */

/*
 * Parallax inside the card imagery. Runs at every size — on a phone this is
 * what makes a card feel alive as it travels up the screen, rather than
 * being a static block that faded in once.
 *
 * The range is smaller on phones: the card crosses the viewport far faster
 * there, so the same offset would read as the image sliding.
 */
mm.add(
  {
    wide: `${MOTION.ok} and (min-width: 640px)`,
    narrow: `${MOTION.ok} and (max-width: 639px)`,
  },
  (context) => {
    const { wide } = context.conditions as { wide: boolean };
    const range = wide ? 6 : 3.5;

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((layer) => {
      gsap.fromTo(
        layer,
        { yPercent: -range },
        {
          yPercent: range,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('li') ?? layer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });
  },
);

/* --------------------------------- pointer effects (fine pointers only) */

mm.add('(pointer: fine)', () => {
  const cards = gsap.utils.toArray<HTMLElement>('[data-spotlight]');

  const onMove = (event: PointerEvent) => {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  cards.forEach((el) => el.addEventListener('pointermove', onMove));
  return () => cards.forEach((el) => el.removeEventListener('pointermove', onMove));
});

mm.add(`${MOTION.ok} and (pointer: fine)`, () => {
  const buttons = gsap.utils.toArray<HTMLElement>('[data-magnetic]');
  const cleanups: Array<() => void> = [];

  buttons.forEach((el) => {
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.16,
        y: (event.clientY - rect.top - rect.height / 2) * 0.28,
        duration: 0.5,
        ease: 'power3.out',
      });
    };
    const leave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { clearProps: 'transform' });
    });
  });

  return () => cleanups.forEach((fn) => fn());
});

/* ----------------------------------------------------------- smooth scroll */

// Desktop only: Lenis hijacks native scrolling and can hurt INP on low-end
// phones, which is where this site's audience actually is.
mm.add(`(min-width: 1024px) and ${MOTION.ok}`, () => {
  // `anchors` is required: Lenis takes over the scroll position, so without it
  // in-page #hash links silently stop working.
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
});
