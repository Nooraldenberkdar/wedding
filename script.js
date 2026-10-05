(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lang = "ar";
  const pad = n => String(n).padStart(2, "0");
  const eventTime = new Date(WEDDING.eventDate).getTime();
  const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };

  function applyConfig() {
    document.title = `${WEDDING.groom} & ${WEDDING.bride} | دعوة زفاف`;
    setText("#groomName", WEDDING.groom); setText("#brideName", WEDDING.bride);
    setText("#footerGroom", WEDDING.groom); setText("#footerBride", WEDDING.bride);
    setText("#venueName", WEDDING.venue); setText("#venueAddress", WEDDING.address);
    setText("#storyText", WEDDING.storyAr); setText("#dateLong", WEDDING.dateLongAr);
    if (WEDDING.monogram) setText("#monogram", WEDDING.monogram);
    $("#mapLink").href = WEDDING.mapsUrl;
    const d = new Date(WEDDING.eventDate);
    setText("#heroDate", `${pad(d.getDate())} . ${pad(d.getMonth() + 1)} . ${d.getFullYear()}`);
    setText("#dateNumeric", `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`);
    setText("#year", d.getFullYear());

    $("#programList").innerHTML = WEDDING.program.map((it, i) => `
      <div class="timeline-item" style="--i:${i}">
        <time>${it.time}</time><span class="dot">${i === 0 ? "♡" : "✿"}</span>
        <p data-ar="${it.ar}" data-en="${it.en}">${it.ar}</p>
      </div>`).join("");

    $("#gallery").innerHTML = WEDDING.gallery.map((src, i) => `
      <button class="gallery-item" type="button" data-i="${i}" aria-label="فتح الصورة ${i + 1}">
        <img src="${src}" alt="صورة ${i + 1}" loading="lazy" onerror="this.parentElement.remove()">
      </button>`).join("");
    $$(".gallery-item").forEach(b => b.addEventListener("click", () => openLightbox(+b.dataset.i)));

    $$(".hero-copy>*").forEach((el, i) => el.style.setProperty("--n", i));
    if (WEDDING.music) $("#music").src = WEDDING.music;
  }

  function countdown() {
    const sec = Math.max(0, Math.floor((eventTime - Date.now()) / 1000));
    const v = { days: Math.floor(sec / 86400), hours: Math.floor(sec % 86400 / 3600), minutes: Math.floor(sec % 3600 / 60), seconds: sec % 60 };
    for (const k in v) {
      const el = $("#" + k), t = pad(v[k]);
      if (el.textContent !== t) { el.textContent = t; if (!reduced) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } }
    }
  }

  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $("#langBtn").textContent = lang === "ar" ? "EN" : "ع";
    $$("[data-ar][data-en]").forEach(el => el.textContent = el.dataset[lang]);
    setText("#dateLong", lang === "ar" ? WEDDING.dateLongAr : WEDDING.dateLongEn);
    setText("#storyText", lang === "ar" ? WEDDING.storyAr : WEDDING.storyEn);
    const o = $$("#attendance option");
    o[0].textContent = lang === "ar" ? "سأحضر" : "I will attend";
    o[1].textContent = lang === "ar" ? "لن أستطيع الحضور" : "I cannot attend";
    $("#guestName").placeholder = lang === "ar" ? "الاسم الكامل" : "Full name";
    $("#guests").placeholder = lang === "ar" ? "عدد الأشخاص" : "Number of guests";
    $("#rsvpBtn").textContent = lang === "ar" ? "إرسال التأكيد" : "Send RSVP";
    $("#mapLink").textContent = lang === "ar" ? "عرض الموقع ⌖" : "Open location ⌖";
  }

  /* lightbox with next / previous / keyboard */
  let lbIndex = 0;
  const imgs = () => [...$$(".gallery-item img")].map(i => i.src);
  function openLightbox(i) {
    const list = imgs(); if (!list.length) return;
    lbIndex = (i + list.length) % list.length;
    let box = $(".lightbox");
    if (!box) {
      box = document.createElement("div"); box.className = "lightbox";
      box.innerHTML = `<button class="lb-x" aria-label="إغلاق">×</button><button class="lb-p" aria-label="السابق">‹</button><button class="lb-n" aria-label="التالي">›</button><img alt="">`;
      box.addEventListener("click", e => {
        if (e.target === box || e.target.classList.contains("lb-x")) closeLightbox();
        else if (e.target.classList.contains("lb-p")) openLightbox(lbIndex - 1);
        else if (e.target.classList.contains("lb-n")) openLightbox(lbIndex + 1);
      });
      document.body.appendChild(box);
    }
    box.querySelector("img").src = list[lbIndex];
  }
  function closeLightbox() { const b = $(".lightbox"); if (b) b.remove(); }
  document.addEventListener("keydown", e => {
    if (!$(".lightbox")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(lbIndex + 1);
    if (e.key === "ArrowRight") openLightbox(lbIndex - 1);
  });

  function setupMusic() {
    const btn = $("#musicBtn"), audio = $("#music");
    audio.addEventListener("error", () => btn.classList.add("disabled"));
    btn.addEventListener("click", async () => {
      if (!audio.src || btn.classList.contains("disabled")) return;
      if (audio.paused) { try { await audio.play(); btn.classList.add("playing"); } catch {} }
      else { audio.pause(); btn.classList.remove("playing"); }
    });
  }

  function setupRsvp() {
    $("#rsvpForm").addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#guestName").value.trim(), yes = $("#attendance").value === "yes", n = $("#guests").value;
      if (!name) return;
      setText("#rsvpStatus", lang === "ar"
        ? (yes ? `شكراً ${name} ❤️ تم تسجيل حضور ${n} شخص.` : `شكراً ${name} ❤️ تم تسجيل اعتذاركم عن الحضور.`)
        : (yes ? `Thank you ${name} ❤️ Attendance for ${n} guest(s) recorded.` : `Thank you ${name} ❤️ Your reply is recorded.`));
      if (WEDDING.whatsapp) {
        const msg = yes ? `مرحباً، أنا ${name}. أؤكد حضوري مع ${n} شخص. مبارك مقدماً 🤍` : `مرحباً، أنا ${name}. أعتذر عن الحضور. مبارك مقدماً 🤍`;
        window.open(`https://wa.me/${WEDDING.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      }
    });
  }

  /* add to calendar (.ics) */
  function setupCalendar() {
    $("#calBtn").addEventListener("click", () => {
      const f = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
      const s = new Date(WEDDING.eventDate), en = new Date(s.getTime() + 4 * 3600e3);
      const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${f(s)}`, `DTEND:${f(en)}`,
        `SUMMARY:${WEDDING.groom} & ${WEDDING.bride}`, `LOCATION:${WEDDING.venue} - ${WEDDING.address}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = "wedding.ics"; a.click(); URL.revokeObjectURL(a.href);
    });
  }

  function setupPetals() {
    if (reduced) return;
    const box = $("#petals");
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("span");
      p.textContent = i % 3 ? "✿" : "❀";
      p.style.cssText = `left:${Math.random() * 100}%;font-size:${12 + Math.random() * 14}px;animation-duration:${9 + Math.random() * 8}s;animation-delay:${Math.random() * 10}s;--dx:${(Math.random() - .5) * 120}px`;
      box.appendChild(p);
    }
  }

  function setupReveal() {
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
    $$(".section-heading,.count-card,.timeline-item,.map-card,.story-card,.gallery-item,.rsvp-form,.footer>*").forEach((el, i) => {
      el.classList.add("reveal");
      if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", el.classList.contains("count-card") || el.classList.contains("gallery-item") ? i % 4 : 0);
      io.observe(el);
    });
  }

  function openInvitation() {
    const env = $("#envelope");
    env.classList.add("open");
    document.body.classList.remove("locked");
    document.body.classList.add("started");
    $("#app").setAttribute("aria-hidden", "false");
    const audio = $("#music");
    if (audio.src) audio.play().then(() => $("#musicBtn").classList.add("playing")).catch(() => {});
    setTimeout(() => env.classList.add("gone"), 1400);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig(); countdown(); setInterval(countdown, 1000);
    setupMusic(); setupRsvp(); setupCalendar(); setupPetals(); setupReveal();
    $("#langBtn").addEventListener("click", () => setLanguage(lang === "ar" ? "en" : "ar"));
    $("#openBtn").addEventListener("click", openInvitation);
  });
})();
