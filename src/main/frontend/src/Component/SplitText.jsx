import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function SplitText({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete = () => {},
}) {
  const textRef = useRef(null);

  // 글자/단어 분리
  const splitTargets =
    splitType === "chars"
      ? text.split("").map((char, i) => (
          <span
            key={i}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </span>
        ))
      : text.split(" ").map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {word}{" "}
          </span>
        ));

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = el.querySelectorAll("span");
            gsap.fromTo(
              targets,
              from,
              {
                ...to,
                duration,
                ease,
                delay: delay / 1000,
                stagger: 0.05,
                onComplete: onLetterAnimationComplete,
              }
            );
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [
    delay,
    duration,
    ease,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <div
      ref={textRef}
      className={className}
      style={{ display: "inline-block", textAlign }}
    >
      {splitTargets}
    </div>
  );
}

export default SplitText;
