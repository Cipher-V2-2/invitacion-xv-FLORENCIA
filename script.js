// =========================================================
// CONFIGURACIÓN: pegá acá los datos de tu Google Form
// (ver instrucciones.md, "Alternativa con Google Form")
// =========================================================

// URL de envío del formulario (termina en /formResponse)
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd7Adj4zugGsFBQ7C2GbiBy3WYctsNnbDZzWRfwbLHdrdvb1g/formResponse";

// Los "entry.XXXXXXXXX" de cada pregunta del Google Form
const ENTRY_IDS = {
  nombre: "entry.304660487",
  asistencia: "entry.1577048088",
  adultos: "entry.1920579280",
  ninos: "entry.947002461",
  adolescentes: "entry.1539754913",
  restriccion: "entry.1916187370"
};

const form = document.getElementById('rsvpForm');
const mensajeEstado = document.getElementById('mensajeEstado');

// ===== Cuenta regresiva =====
const fechaEvento = new Date('2026-09-26T21:00:00');

function actualizarCuentaRegresiva() {
  const ahora = new Date();
  const diferencia = fechaEvento - ahora;

  const elDias = document.getElementById('cr-dias');
  const elHoras = document.getElementById('cr-horas');
  const elMin = document.getElementById('cr-min');
  const elSeg = document.getElementById('cr-seg');

  if (!elDias) return;

  if (diferencia <= 0) {
    elDias.textContent = '00';
    elHoras.textContent = '00';
    elMin.textContent = '00';
    elSeg.textContent = '00';
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  elDias.textContent = String(dias).padStart(2, '0');
  elHoras.textContent = String(horas).padStart(2, '0');
  elMin.textContent = String(minutos).padStart(2, '0');
  elSeg.textContent = String(segundos).padStart(2, '0');
}

actualizarCuentaRegresiva();
setInterval(actualizarCuentaRegresiva, 1000);

// ===== Envío del formulario a Google Form =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const boton = form.querySelector('.boton-enviar');
  boton.disabled = true;
  boton.textContent = 'Enviando...';
  mensajeEstado.textContent = '';
  mensajeEstado.style.color = '';

  const formData = new FormData(form);
  const datos = Object.fromEntries(formData.entries());

  // Armamos el cuerpo del pedido con los entry.XXXX de Google Forms
  const cuerpo = new URLSearchParams();
  cuerpo.append(ENTRY_IDS.nombre, datos.nombre || '');
  cuerpo.append(ENTRY_IDS.asistencia, datos.asistencia || '');
  cuerpo.append(ENTRY_IDS.adultos, datos.adultos || '');
  cuerpo.append(ENTRY_IDS.ninos, datos.ninos || '');
  cuerpo.append(ENTRY_IDS.adolescentes, datos.adolescentes || '');
  cuerpo.append(ENTRY_IDS.restriccion, datos.restriccion || '');

  try {
    await fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Forms no devuelve headers CORS, esto es normal y esperado
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: cuerpo.toString()
    });

    // Con mode "no-cors" no podemos leer la respuesta, así que asumimos éxito
    mensajeEstado.style.color = '#3a8a4a';
    mensajeEstado.textContent = '¡Gracias! Tu confirmación fue enviada correctamente.';
    form.reset();
    boton.textContent = 'Enviar';
    boton.disabled = false;
  } catch (error) {
    mensajeEstado.style.color = '#b3261e';
    mensajeEstado.textContent = 'Hubo un error al enviar. Probá de nuevo en un momento.';
    boton.textContent = 'Enviar';
    boton.disabled = false;
  }
});
