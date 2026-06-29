// Interacciones generales: reveal editorial, hover de cursos, partes de guitarra y marquee continuo.
document.addEventListener("DOMContentLoaded", () => {
  // Revela bloques al entrar en pantalla para mantener una lectura pausada.
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
        const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
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

  // Cursos: la tarjeta activa cambia con hover y foco, manteniendo siempre un programa destacado.
  const courseCards = document.querySelectorAll(".course-card");
  courseCards.forEach((card) => {
    const activate = () => {
      courseCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    };

    card.addEventListener("mouseenter", activate);
    card.addEventListener("focusin", activate);
  });

  // Partes de guitarra: cada item actualiza imagen placeholder y descripcion.
  const partButtons = document.querySelectorAll(".part-item");
  const partsImage = document.querySelector("#parts-image");
  const partsDescription = document.querySelector("#parts-description");

  partButtons.forEach((button) => {
    button.addEventListener("click", () => {
      partButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      partsImage.src = button.dataset.image;
      partsImage.alt = `Placeholder de ${button.textContent.trim()}`;
      partsDescription.textContent = button.dataset.description;
    });
  });

  // Marquee: duplica el contenido para lograr un loop visual sin salto.
  const marquee = document.querySelector(".marquee-track");
  if (marquee) {
    marquee.innerHTML += marquee.innerHTML;
  }

  // Autoplay / pause video when in view (requires muted for autoplay to work reliably)
  const workshopVideo = document.querySelector('.video-placeholder');
  if (workshopVideo) {
    // ensure muted and loop are set
    workshopVideo.muted = true;
    workshopVideo.loop = true;
      // hide native controls and make non-focusable to avoid showing playback UI
      workshopVideo.controls = false;
      workshopVideo.setAttribute('tabindex', '-1');

    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // try to play; play() returns a promise
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
