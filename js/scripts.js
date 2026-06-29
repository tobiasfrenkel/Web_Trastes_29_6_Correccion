// Interacciones generales: reveal editorial, hover de cursos, partes de guitarra y marquee continuo.
document.addEventListener("DOMContentLoaded", () => {

  // Revela bloques al entrar en pantalla
  const revealItems = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => revealObserver.observe(item));


  // =========================
  // STATEMENT FILL ANIMATION
  // =========================
  const fillStatements = document.querySelectorAll(".statement");

  if (fillStatements.length > 0) {

    const wrapTextContent = (container, text) => {
      text.split(/(\s+)/).forEach((part) => {
        if (/^\s+$/.test(part)) {
          container.appendChild(document.createTextNode(part));
          return;
        }

        const wordSpan = document.createElement("span");
        wordSpan.className = "statement-word";

        part.split("").forEach((char) => {
          const span = document.createElement("span");
          span.className = "statement-char";
          span.textContent = char;
          wordSpan.appendChild(span);
        });

        container.appendChild(wordSpan);
      });
    };

    fillStatements.forEach((statement) => {
      const originalNodes = Array.from(statement.childNodes);
      statement.innerHTML = "";

      originalNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && /^\s*$/.test(node.textContent || "")) {
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
          statement.appendChild(document.createElement("br"));
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("statement-line")) {
          const line = document.createElement("span");
          line.className = "statement-line";
          wrapTextContent(line, node.textContent || "");
          statement.appendChild(line);
          return;
        }

        wrapTextContent(statement, node.textContent || "");
      });
    });

    const updateFill = () => {
      fillStatements.forEach((statement) => {
        const chars = statement.querySelectorAll(".statement-char");
        const rect = statement.getBoundingClientRect();
        const winHeight = window.innerHeight;

        const start = winHeight * 0.95;
        const end = winHeight * 0.25;

        const progress = Math.min(
          Math.max((start - rect.top) / (start - end), 0),
          1
        );

        const fillCount = Math.round(progress * chars.length);

        chars.forEach((char, index) => {
          if (index < fillCount) {
            char.classList.add("is-filled");
          } else {
            char.classList.remove("is-filled");
          }
        });
      });
    };

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateFill();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateFill();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFill);
  }


  // =========================
  // COURSE HOVER VIDEOS
  // =========================
  const courseCards = document.querySelectorAll(".course-card");

  courseCards.forEach((card) => {
    const video = card.querySelector(".course-video");

    const activate = () => {

      courseCards.forEach((item) => {
        item.classList.remove("is-active");

        const otherVideo = item.querySelector(".course-video");
        if (otherVideo) {
          otherVideo.pause();
          otherVideo.currentTime = 0;
        }
      });

      card.classList.add("is-active");

      if (video) {
        video.currentTime = 0;
        video.play();
      }
    };

    card.addEventListener("mouseenter", activate);
    card.addEventListener("focusin", activate);
  });


  // =========================
  // PARTES DE GUITARRA
  // =========================
  const partBlocks = document.querySelectorAll(".part-block");
  const partsImage = document.querySelector("#parts-image");

  function activateBlock(block) {
    if (!partsImage) return;
    if (block.classList.contains("is-selected")) return;

    partBlocks.forEach(item => item.classList.remove("is-selected"));
    block.classList.add("is-selected");

    const button = block.querySelector(".part-item");

    partsImage.classList.remove("is-visible");

    setTimeout(() => {
      partsImage.src = button.dataset.image;
      partsImage.alt = button.textContent.trim();
      partsImage.classList.add("is-visible");
    }, 180);
  }

  partBlocks.forEach((block) => {
    const button = block.querySelector(".part-item");

    button.addEventListener("click", () => {
      activateBlock(block);
    });
  });

  if (partsImage) {
    partsImage.classList.add("is-visible");
  }

  const impact = document.querySelector(".impact");

  if (impact) {

    let targetX = 50;
    let targetY = 50;

    let currentX = 50;
    let currentY = 50;

    let offsetX = 0;
    let offsetY = 0;

    impact.addEventListener("mousemove", (e) => {
      const rect = impact.getBoundingClientRect();

      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;

      const dx = (e.clientX - rect.left - rect.width / 2) * 0.08;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.08;

      offsetX = dx;
      offsetY = dy;
    });

    function animate() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      offsetX *= 0.92;
      offsetY *= 0.92;

      impact.style.setProperty("--x", currentX + "%");
      impact.style.setProperty("--y", currentY + "%");

      impact.style.setProperty("--dx", offsetX);
      impact.style.setProperty("--dy", offsetY);

      requestAnimationFrame(animate);
    }

    animate();
  }


  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.innerHTML += marquee.innerHTML;
  }


  const workshopVideo = document.querySelector('.video-placeholder');

  if (workshopVideo) {
    workshopVideo.muted = true;
    workshopVideo.loop = true;
    workshopVideo.controls = false;
    workshopVideo.setAttribute('tabindex', '-1');

    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const p = workshopVideo.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          workshopVideo.pause();
        }
      });
    }, { threshold: [0.25, 0.5, 0.75] });

    playObserver.observe(workshopVideo);
  }

});