// News is curated in index.html; no credentials or third-party scraping are needed.
(() => {
    const section = document.getElementById('news');
    const track = document.getElementById('news-track');
    const toggle = document.getElementById('news-pause');
    if (!section || !track || !toggle) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    let hovered = false;
    let focused = false;
    let lastInteraction = 0;
    let visible = false;
    const updateToggle = () => {
        toggle.textContent = paused ? 'Play' : 'Pause';
        toggle.setAttribute('aria-label', paused ? 'Play automatic news scrolling' : 'Pause automatic news scrolling');
    };
    const advance = (direction) => {
        const step = track.querySelector('.news-card').getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
        const end = track.scrollWidth - track.clientWidth;
        let next = track.scrollLeft + direction * step;
        if (next > end + 1) next = 0;
        if (next < -1) next = end;
        track.scrollTo({ left: next, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    };
    toggle.addEventListener('click', () => { paused = !paused; updateToggle(); });
    section.querySelectorAll('[data-news-direction]').forEach(button => {
        button.addEventListener('click', () => { lastInteraction = Date.now(); advance(Number(button.dataset.newsDirection)); });
    });
    section.addEventListener('mouseenter', () => { hovered = true; });
    section.addEventListener('mouseleave', () => { hovered = false; });
    section.addEventListener('focusin', () => { focused = true; });
    section.addEventListener('focusout', event => { focused = section.contains(event.relatedTarget); });
    ['pointerdown', 'wheel', 'keydown'].forEach(type => track.addEventListener(type, () => { lastInteraction = Date.now(); }, { passive: true }));
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateToggle(); });
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(section);
    setInterval(() => {
        if (!paused && !hovered && !focused && visible && !document.hidden && Date.now() - lastInteraction > 8000) advance(1);
    }, 6000);
    updateToggle();
})();
