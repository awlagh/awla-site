/* nav-theme.js · AWLA · extraído de curso.html (Fase 1 /cursos, 2026-09-25)
   Alterna la clase .light en <nav id="nav"> según si el nav está
   sobre una sección oscura (.hero, .s-sticker, .s-pay) o sobre papel.
   Reutilizable tal cual en cualquier página de curso que tenga un
   <nav id="nav"> con esas mismas secciones (las que no existan en
   una página dada simplemente se ignoran, querySelector regresa null). */
(function navTheme(){
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const sticker = document.querySelector('.s-sticker');
  const pay  = document.querySelector('.s-pay');
  if (!nav || !hero) return;

  let ticking = false;
  let cachedNavHeight = nav.offsetHeight;

  function isOverDark(el, navHeight) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < navHeight && r.bottom > navHeight;
  }

  function checkTheme() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const overHero = heroBottom > cachedNavHeight;
    const overSticker = isOverDark(sticker, cachedNavHeight);
    const overPay = isOverDark(pay, cachedNavHeight);
    const inDark = overHero || overSticker || overPay;
    nav.classList.toggle('light', !inDark);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(checkTheme);
      ticking = true;
    }
  }

  checkTheme();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    cachedNavHeight = nav.offsetHeight;
    onScroll();
  });
})();
