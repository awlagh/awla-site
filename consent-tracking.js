/**
 * AWLA · Registro de consentimientos (lado cliente)
 * -------------------------------------------------
 * Envía cada consentimiento al endpoint /consent (Pages Function → base D1).
 * Se engancha a las funciones del banner de cookies SIN modificar su lógica,
 * así que basta con cargar este archivo en cualquier página del sitio.
 *
 * También expone window.awlaRegistrarConsentimiento(datos) para registrar
 * consentimientos puntuales (por ejemplo, la aceptación en el checkout de pago).
 */
(function () {
  var ENDPOINT = '/consent';
  var VERSION = '1.0';

  // Función global reutilizable: registra un consentimiento.
  window.awlaRegistrarConsentimiento = function (datos) {
    datos = datos || {};
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:   datos.email   || null,
          version: datos.version || VERSION,
          medio:   datos.medio   || 'web',
          tipo:    datos.tipo    || null
        }),
        keepalive: true   // permite que el envío termine aunque la página navegue
      }).catch(function () { /* silencioso: nunca bloquea al usuario */ });
    } catch (e) { /* noop */ }
  };

  // Envuelve una función global del banner para registrar antes de ejecutarla.
  function envolver(nombre, medio, tipo) {
    var orig = window[nombre];
    if (typeof orig !== 'function') return;          // si no existe en esta página, ignora
    if (orig.__awlaWrapped) return;                  // evita doble envoltura
    var wrapped = function () {
      window.awlaRegistrarConsentimiento({ medio: medio, tipo: tipo });
      return orig.apply(this, arguments);
    };
    wrapped.__awlaWrapped = true;
    window[nombre] = wrapped;
  }

  function enganchar() {
    envolver('ckAcceptAll', 'banner-cookies', 'aceptar-todo');
    envolver('ckRejectAll', 'banner-cookies', 'rechazar');
    envolver('ckReject',    'banner-cookies', 'rechazar');
    envolver('ckSavePrefs', 'banner-cookies', 'personalizar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enganchar);
  } else {
    enganchar();
  }
})();
