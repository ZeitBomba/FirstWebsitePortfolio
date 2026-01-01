// function scrollToSection() {
//     document.getElementById("aboutMeDiv").scrollIntoView({ behavior: "smooth" });
//   }

// // If a section becomes active
// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('visible');
//       // Optional: uncomment this if running only once
//       observer.unobserve(entry.target);
//     } else {
//       entry.target.classList.remove('visible');
//     }
//   });
// }, {
//   threshold: 0.5
// });

// // Selects all target elements
// const sections = document.querySelectorAll('.aboutMeHeader1, .aboutMeHeader2, .aboutMeContent p, .topicHeader, .resumeHeader, .resume-block');

// // Observe each section
// sections.forEach(section => observer.observe(section));


// // Animation for section 2
// document.addEventListener("DOMContentLoaded", () => {
//   const header1 = document.querySelector(".aboutMeHeader1");
//   const header2 = document.querySelector(".aboutMeHeader2");
//   const content = document.querySelector(".aboutMeContent");

//   // match animation duration from CSS (5s)
//   const animationDuration = 5000; 

//   // reveal after text animations finish
//   setTimeout(() => {
//     content.classList.add("visible");
//   }, animationDuration - 1000); // start fading in a bit before they exit completely
// });

function scrollToSection() {
  document.getElementById("aboutMeDiv").scrollIntoView({ behavior: "smooth" });
}

// IntersectionObserver – reveals the headers
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);

      // Attach animation-end listeners IF these are the big headers
      if (entry.target.classList.contains("aboutMeHeader1")) {
        attachAnimationEndListener(entry.target, "left");
      }
      if (entry.target.classList.contains("aboutMeHeader2")) {
        attachAnimationEndListener(entry.target, "right");
      }

    } else {
      entry.target.classList.remove('visible');
      entry.target._listenerAttached = false;
    }
  });
}, {
  threshold: 0.5
});

// Observe all elements
const sections = document.querySelectorAll(
  '.aboutMeHeader1, .aboutMeHeader2, .topicHeader, .resumeHeader, .resume-block, .card'
);

sections.forEach(section => observer.observe(section));


// --------------------
// ANIMATION REVEAL LOGIC
// --------------------
const LEFT_ANIMATION_NAME = "convergeAndExitRight";
const RIGHT_ANIMATION_NAME = "convergeAndExitLeft";

const finished = new Set();
const content = document.querySelector(".aboutMeContent");

// Fallback in rare case animationend does not fire
const FALLBACK_TIMEOUT = 4000;
let fallbackTimer = null;

function tryRevealContent() {
  if (finished.has("left") && finished.has("right")) {
    clearTimeout(fallbackTimer);
    content.classList.add("visible");
  }
}

function attachAnimationEndListener(header, side) {
  if (header._listenerAttached) return;
  header._listenerAttached = true;

  const onAnimEnd = (e) => {
    if (side === "left" && e.animationName === LEFT_ANIMATION_NAME) {
      finished.add("left");
      header.removeEventListener("animationend", onAnimEnd);
      tryRevealContent();
    }
    if (side === "right" && e.animationName === RIGHT_ANIMATION_NAME) {
      finished.add("right");
      header.removeEventListener("animationend", onAnimEnd);
      tryRevealContent();
    }
  };

  header.addEventListener("animationend", onAnimEnd);

  // fallback timer
  clearTimeout(fallbackTimer);
  fallbackTimer = setTimeout(() => {
    content.classList.add("visible");
  }, FALLBACK_TIMEOUT);
}
