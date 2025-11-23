document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.1 });

  document.querySelectorAll('.reveal, .card').forEach(el => observer.observe(el));

  const scrollHeadings = document.querySelectorAll('[data-scroll-heading]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (scrollHeadings.length && !reduceMotion.matches) {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    let ticking = false;

    const updateHeadingMotion = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const start = viewportHeight * 0.55;
      const end = viewportHeight * 0.12;

      scrollHeadings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        const rawProgress = (start - rect.top) / (start - end);
        const progress = clamp(rawProgress, 0, 1);
        heading.style.setProperty('--scroll-progress', progress.toFixed(4));
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeadingMotion);
      }
    };

    updateHeadingMotion();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }
});
