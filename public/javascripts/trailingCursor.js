document.addEventListener("DOMContentLoaded", () => {
  const trailCount = 10;
  const trailDots = [];

  // Create trail dots
  for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("trail-dot");
    document.body.appendChild(dot);
    trailDots.push(dot);
  }

  // Mouse move handler
  document.addEventListener("mousemove", (e) => {
    gsap.to(trailDots, {
      left: e.clientX,
      top: e.clientY,
      stagger: 0.02,
      ease: "power1.out",
      duration: 0.5,
    });
  });

  // Interaction effects
  const container = document.getElementById("root");

  container.addEventListener("mouseenter", () => {
    gsap.to(trailDots, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      stagger: 0.05,
    });
  });

  container.addEventListener("mouseleave", () => {
    gsap.to(trailDots, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
    });
  });
});
