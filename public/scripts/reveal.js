if (typeof window === "undefined") {
  // サーバーでは何もしない
} else {
  window.addEventListener("DOMContentLoaded", () => {
    const targets = Array.from(document.querySelectorAll("[data-reveal]"));

    if (targets.length === 0) return;

    const setVisible = (el, animate = true) => {
      el.classList.add("is-visible");
      if (!animate) el.classList.add("no-animate");
    };

    const isAbove = (el) =>
      el.getBoundingClientRect().bottom < 0;

    const isInView = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    targets.forEach((el) => {
      if (isAbove(el)) setVisible(el, false);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => setVisible(el, false));
      return;
    }

    let lastY = window.scrollY;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        const currentY = window.scrollY;
        const scrollingDown = currentY >= lastY;
        lastY = currentY;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(entry.target, scrollingDown);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach((el) => {
      if (window.scrollY > 0 && isInView(el)) {
        setVisible(el, false);
      } else if (!el.classList.contains("is-visible")) {
        observer.observe(el);
      }
    });
  });
}
