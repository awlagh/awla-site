/* testimonios.js · AWLA
 * ÚNICA fuente de los testimonios del sitio (index, /cursos y páginas de curso).
 * Para agregar uno: copia una línea de la lista, pega el texto y el autor, y sube
 * SOLO este archivo a GitHub. Se actualiza en todas las páginas a la vez.
 *
 * Campos:
 *   q: el testimonio, entre comillas (si lleva comillas dobles dentro, usa « » o \")
 *   a: cómo se firma. "@usuario", nombre, o "Alumno de AWLA" si pidió anonimato.
 * El orden de la lista es el orden en pantalla (el primero sale primero).
 * Solo publicar testimonios con autorización en el formulario.
 */
(function () {
  var TESTIMONIOS = [
    // ── Gen01 · Del texto a la pieza (oct 2026) ──
    { q: "Increíble, Pablo es realmente bueno y explica muy bien. Me abrió por completo el panorama de la IA.", a: "@little_floweredthong" },
    { q: "Me gustó que fue muy estructurada, puntual, además el profe da demostraciones en el momento, y a mí los resúmenes y las sesiones grabadas me ayudan mucho.", a: "@zepzilia" },
    { q: "Muy interesante y me ayuda ver dónde estoy como estudiante de la IA.", a: "Jairo Barrera" },
    { q: "Que no existe una fórmula mágica, sino experimentación y trabajo constante.", a: "@noemicot" },
    { q: "Lo más valioso fueron las clases de Midjourney. Es una herramienta clave para lograr una estética poderosa.", a: "@chrlievazquez" },
    { q: "Me llevo los tips y cuestiones técnicas que necesitaba aprender para gestionar un video en IA.", a: "Alumno de AWLA" },

    // ── Cursos previos ──
    { q: "El curso me pareció genial para iniciar en el mundo de la IA, es altamente recomendable. Particularmente lo uso para trabajar en creación de imagen. Pablo también fue un gran asesor, siempre resolviendo las dudas en todo momento.", a: "@pepzlaroid" },
    { q: "El curso de AWLA fue una excelente introducción al mundo de la Inteligencia Artificial, especialmente para aprender a usar Midjourney y la creación de imágenes con IA. Como creativo, suelo necesitar referencias audiovisuales, y encontrar la imagen adecuada puede ser tardado; este curso me dio una alternativa clave: generar imágenes mediante prompts, logrando mayor precisión al comunicar ideas en pitches.", a: "@ledicenelvega" },
    { q: "El curso que tomé en AWLA, además de ser express, me ayudó a integrar la inteligencia artificial como parte de mis herramientas creativas para llegar más lejos en el desarrollo de mis proyectos e ideas.", a: "@vlakat" },
    { q: "Excelente el curso. Me resultó muy útil, muy claro y práctico.", a: "@karinaminujin" },
    { q: "Tomé este curso y me pareció sensacional la forma de abordar a la IA desde una perspectiva cinematográfica.", a: "@aresvid" },
    { q: "Recomiendo ampliamente el curso de IA. El instructor es muy experimentado y despejó todas mis inquietudes de manera muy clara.", a: "@maucastrodirector" },
    { q: "Estoy muy satisfecho, feliz y agradecido de haber recibido tu asesoría, fue tan nutritivo que a partir de él por fin pude crear algo cinematográfico. Mis obstáculos desaparecieron y ahora exploro nuevas herramientas porque me siento seguro. Antes andaba dando palos a ciegas, gracias a ti ya sé qué buscar y cómo encontrar lo que necesito.", a: "@pacodel61" }
  ];

  /* ── Render (no hace falta tocar nada de aquí hacia abajo) ── */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render() {
    var grid = document.getElementById('testi-grid');
    if (!grid || !TESTIMONIOS.length) return;

    grid.textContent = '';
    TESTIMONIOS.forEach(function (t) {
      var cell = el('article', 'testi-cell');
      var mark = el('span', 'testi-mark', '"');
      mark.setAttribute('aria-hidden', 'true');
      var author = el('p', 'testi-author');
      author.appendChild(el('span', null, t.a));
      cell.appendChild(mark);
      cell.appendChild(el('p', 'testi-quote', t.q));
      cell.appendChild(author);
      grid.appendChild(cell);
    });

    var nav = document.querySelector('.testi-slider-nav');
    var dots = [];
    if (nav) {
      nav.textContent = '';
      TESTIMONIOS.forEach(function (_, i) {
        var d = el('button', 'testi-dot' + (i === 0 ? ' is-active' : ''));
        d.type = 'button';
        d.setAttribute('aria-label', 'Testimonio ' + (i + 1));
        nav.appendChild(d);
        dots.push(d);
      });
    }

    var count = document.querySelector('.testi-foot-v');
    if (count) count.textContent = TESTIMONIOS.length + ' opiniones';

    // Sincronía dots ↔ scroll
    var ticking = false;
    grid.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var first = grid.children[0];
        var step = first ? first.offsetWidth + 16 : 1;
        var idx = Math.min(dots.length - 1, Math.round(grid.scrollLeft / step));
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
        ticking = false;
      });
    }, { passive: true });

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        var c = grid.children[i];
        if (c) grid.scrollTo({ left: c.offsetLeft - grid.offsetLeft, behavior: 'smooth' });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
