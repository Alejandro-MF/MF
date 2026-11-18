// ==========================================
// CONFIGURACIÓN DE GOOGLE FORMS
// ==========================================
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc_ZR4Z7yuV6JWutUJCbXqxPj2eGd2oHrInGjMQqvEbbd5JWw/formResponse";

const ENTRY_IDS = {
  reto1: "entry.1355387075", // ID Reto 1 (SI / NO)
  reto2: "entry.350532097",  // ID Reto 2 (Respuesta texto)
  reto3: "entry.1931101628", // ID Reto 3 (Zy / No / Ctm)
  reto4: "entry.1121720971", // ID Reto 4 (Nivel de drama 1-10)
  mensaje: "entry.773627864" // ID Comentario final
};

// Almacén de respuestas
const respuestas = {
  reto1: "",
  reto2: "",
  reto3: "",
  reto4: "10",
  mensaje: ""
};

// Variable para saber si descubrió el secreto
let secretoEncontrado = false;

// Navegación entre páginas
function cambiarPagina(actualId, siguienteId) {
  const actual = document.getElementById(actualId);
  const siguiente = document.getElementById(siguienteId);
  
  if (actual) {
    actual.classList.remove("active");
    actual.classList.add("hidden");
    actual.style.display = "none";
  }
  if (siguiente) {
    siguiente.classList.remove("hidden");
    siguiente.classList.add("active");
    siguiente.style.display = "flex";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// INICIAR QUIZ
function iniciarQuiz() {
  cambiarPagina("page-0", "page-1");
}

let flashTimeout = null;

function mostrarFlashazoError(texto, segundos = 3, alTerminarCallback) {
  const overlay = document.getElementById("flash-overlay");
  const emojiEl = document.getElementById("flash-emoji");
  const textEl = document.getElementById("flash-text");
  const barEl = document.getElementById("flash-timer-bar");

  if (!overlay) return;
  if (flashTimeout) clearTimeout(flashTimeout);

  if (emojiEl) emojiEl.innerText = "🦭";
  if (textEl) textEl.innerText = texto;
  
  if (barEl) {
    barEl.style.transition = "none";
    barEl.style.width = "100%";
  }
  
  overlay.style.display = "flex";

  // Barra de progreso regresiva
  setTimeout(() => {
    if (barEl) {
      barEl.style.transition = "width " + segundos + "s linear";
      barEl.style.width = "0%";
    }
  }, 50);

  flashTimeout = setTimeout(() => {
    overlay.style.display = "none";
    if (alTerminarCallback) alTerminarCallback();
  }, segundos * 1000);
}

// =======================================================
// TOAST FLOTANTE PARA MENSAJES (NO FLASH NEGRO)
// =======================================================
let toastTimeout = null;
function mostrarToast(mensaje, segundos = 3, alTerminarCallback) {
  let toast = document.getElementById("quiz-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "quiz-toast";
    toast.className = "quiz-toast";
    document.body.appendChild(toast);
  }

  if (toastTimeout) clearTimeout(toastTimeout);

  toast.innerHTML = mensaje;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    if (alTerminarCallback) alTerminarCallback();
  }, segundos * 1000);
}

// =======================================================
// PÁGINA 1: RETO 1 (¿Tus papis saben...?)
// =======================================================
function responderP1(opcion) {
  respuestas.reto1 = opcion;

  if (opcion === "SI") {
    mostrarToast("<strong>JAJA no creo</strong>", 1, () => {
      cambiarPagina("page-1", "page-2");
    });
  } else {
    mostrarToast("<strong>TODA LESBIANA TODA MENTIROSA</strong>", 1, () => {
      cambiarPagina("page-1", "page-2");
    });
  }
}

// =======================================================
// PÁGINA 2: RETO 2 (MANGO / PISTA HOPE / ESPERANZA / SECRETO)
// =======================================================


function validarR2() {
  const inputEl = document.getElementById("input-r2");
  if (!inputEl) return;
  
  const rawVal = inputEl.value.trim();
  // Normalizar: minúsculas y sin acentos ni espacios extra
  const val = rawVal.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (!val) {
    mostrarFlashazoError("Escribe pue", 1);
    return;
  }

  const palabrasObscenas = ["vrga", "verga", "pito", "pene", "verguita", "vga", "polla", "pitorro"];
  const esObsceno = palabrasObscenas.some(p => val.includes(p));

  if (esObsceno) {
    mostrarFlashazoError("¡DIJE QUE NO VALEEEE!", 2);
    inputEl.value = "";
    return;
  }

  // Lista de nombres o palabras clave que activan el secreto:
  const secretos = ["yo", "maffer", "maffers", "maria", "fernanda", "maria fernanda", "fer"];
  const esSecreto = secretos.includes(val);

  if (esSecreto) {
    secretoEncontrado = true;
    respuestas.reto2 = rawVal + " (Descubrió el secreto wtf)";
    document.body.classList.remove("hope-bg");
    
    if (typeof confetti === "function") {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }

    // Avanza de forma normal como si fuera correcto
    cambiarPagina("page-2", "page-3");
    return;
  }

  // Respuesta estándar correcta: 'esperanza'
  if (val === "esperanza") {
    secretoEncontrado = false;
    respuestas.reto2 = rawVal;
    document.body.classList.remove("hope-bg");
    
    if (typeof confetti === "function") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    cambiarPagina("page-2", "page-3");
  } else {
    mostrarFlashazoError("MAL mi favorita es la esper...", 1.5);
  }
}

// =======================================================
// PÁGINA 3: RETO 3 (DESORGANIZADA / BARRER Y TRAPEAR)
// =======================================================
function validarR3() {
  const radios = document.getElementsByName("reto3");
  let seleccionado = null;
  for (const r of radios) {
    if (r.checked) {
      seleccionado = r.value;
      break;
    }
  }

  if (!seleccionado) {
    alert("selecciona algo >:c");
    return;
  }

  respuestas.reto3 = seleccionado;

  if (seleccionado === "Zy") {
    // Mensaje rápido estilo primera pregunta y avanzar de forma normal
    mostrarToast(" <strong>Good girl</strong> ", 1.5, () => {
      cambiarPagina("page-3", "page-4");
    });
  } else if (seleccionado === "Ctm") {
    // Flashazo de la foca con mensaje 'La tuya' y seguir de forma normal
    mostrarFlashazoError("La tuya ", 2, () => {
      cambiarPagina("page-3", "page-4");
    });
  } else {
    // Si puso 'No', se queda ahí para que organice
    mostrarFlashazoError("Pues que esperas", 2);
  }
}

// =======================================================
// PÁGINA 4: RETO 4 (DRAMA SLIDER)
// =======================================================
function responderP4() {
  const dramaEl = document.getElementById("drama-range");
  const dramaVal = dramaEl ? dramaEl.value : "10";
  respuestas.reto4 = dramaVal;
  cambiarPagina("page-4", "page-5");
}

// =======================================================
// PÁGINA 5: FINAL Y ENVÍO A GOOGLE FORMS
// =======================================================
async function finalizarYEnviar() {
  const inputFinal = document.getElementById("mensaje-final");
  const comentario = inputFinal ? inputFinal.value.trim() : "";
  respuestas.mensaje = comentario;

  const btn = document.getElementById("btn-final-enviar");
  if (btn) {
    btn.disabled = true;
    btn.innerText = "jakiadaᴹᴵ ᶜᴼᴹᴵᴰᴬ ᶠᴬⱽᴼᴿᴵᵀᴬ ⁼ ᵀᵁ";
  }

  const formData = new URLSearchParams();
  formData.append(ENTRY_IDS.reto1, respuestas.reto1);
  formData.append(ENTRY_IDS.reto2, respuestas.reto2);
  formData.append(ENTRY_IDS.reto3, respuestas.reto3);
  formData.append(ENTRY_IDS.reto4, "Que tanto me soporta " + respuestas.reto4 + "/10");
  formData.append(ENTRY_IDS.mensaje, respuestas.mensaje || "Sin comentarios");

  try {
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });
    console.log("Enviado correctamente:", respuestas);
  } catch (err) {
    console.warn("Error en envío:", err);
  }

  if (typeof confetti === "function") {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
  }

  // Si descubrió el secreto, damos 3 segundos para que lea 'jakiada' en el botón
  const tiempoEspera = secretoEncontrado ? 100 : 500;

  setTimeout(() => {
    if (secretoEncontrado) {
      cambiarPagina("page-5", "page-secret");
    } else {
      cambiarPagina("page-5", "page-6");
    }
  }, tiempoEspera);
}

// Función para continuar desde la pantalla secreta a la conclusión final
function continuarDesdeSecreto() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
  }
  cambiarPagina("page-secret", "page-6");
}

// =======================================================
// CERRAR PÁGINA
// =======================================================
function cerrarWeb() {
  window.open("", "_self", "");
  window.close();

  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #000000;
      color: #64748b;
      font-family: sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
      <h2 style="color: #ffffff; margin-bottom: 10px;">Sesión Finalizada</h2>
      <p style="font-size: 1.1rem; max-width: 400px; line-height: 1.5;">
        Ya puedes cerrar esta pestaña con tranquilidad en tu navegador. ¡Hasta la próxima! 👋
      </p>
    </div>
  `;
}

// Inicialización de eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("flash-overlay");
  if (overlay) overlay.style.display = "none";

  const inputR2 = document.getElementById("input-r2");
  if (inputR2) {
    inputR2.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        validarR2();
      }
    });
  }
});



// ==========================================
// REINICIAR QUIZ
// ==========================================
function reiniciarQuiz() {
  respuestas.reto1 = "";
  respuestas.reto2 = "";
  respuestas.reto3 = "";
  respuestas.reto4 = "10";
  respuestas.mensaje = "";
  secretoEncontrado = false;

  // Limpiar inputs
  const inputR2 = document.getElementById("input-r2");
  if (inputR2) inputR2.value = "";

  const radios = document.getElementsByName("reto3");
  for (const r of radios) r.checked = false;

  const dramaRange = document.getElementById("drama-range");
  if (dramaRange) dramaRange.value = "10";
  const rangeDisplay = document.getElementById("range-display");
  if (rangeDisplay) rangeDisplay.innerText = "10";

  const msgFinal = document.getElementById("mensaje-final");
  if (msgFinal) msgFinal.value = "";

  const btnFinal = document.getElementById("btn-final-enviar");
  if (btnFinal) {
    btnFinal.disabled = false;
    btnFinal.innerText = "TERMINAR (si fuiste precoz)";
  }

  // Ocultar todas las páginas y volver a la 0
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => {
    p.classList.remove("active");
    p.classList.add("hidden");
    p.style.display = "none";
  });

  const p0 = document.getElementById("page-0");
  if (p0) {
    p0.classList.remove("hidden");
    p0.classList.add("active");
    p0.style.display = "flex";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
