// ==========================================
// 1. BASE DE DATOS FICTICIA (FÁCIL REEMPLAZO)
// ==========================================
const dbJugadoresFicticios = [
    { id: "f1", name: "Lucas Sterling", position: "DC", nationality: "Inglaterra", club: "London FC", grl: 88, rarity: "Élite" },
    { id: "f2", name: "Mateo Silva", position: "DFC", nationality: "Brasil", club: "Madrid Rey", club: "Rio FC", grl: 82, rarity: "Especial" },
    { id: "f3", name: "Klaus Fischer", position: "POR", nationality: "Alemania", club: "Munich City", grl: 79, rarity: "Común" },
    { id: "f4", name: "Antoine Dupont", position: "MC", nationality: "Francia", club: "Paris V", grl: 85, rarity: "Élite" },
    { id: "f5", name: "Alessandro Rossi", position: "LI", nationality: "Italia", club: "Milán AC", grl: 74, rarity: "Común" },
    { id: "f6", name: "Diego Maradona (Fict)", position: "MC", nationality: "Argentina", club: "Históricos", grl: 96, rarity: "Ícono" },
    { id: "f7", name: "Pelé (Fict)", position: "DC", nationality: "Brasil", club: "Históricos", grl: 98, rarity: "Ícono" },
    { id: "f8", name: "Xavi Simonsen", position: "MC", nationality: "Países Bajos", club: "Amsterdam", grl: 81, rarity: "Especial" },
    { id: "f9", name: "Marcus Rashford (Fict)", position: "EI", nationality: "Inglaterra", club: "Manchester", grl: 84, rarity: "Especial" },
    { id: "f10", name: "Carles Puyol (Fict)", position: "DFC", nationality: "España", club: "Históricos", grl: 95, rarity: "Ícono" },
    { id: "f11", name: "Dani Carvajal (Fict)", position: "LD", nationality: "España", club: "Madrid", grl: 86, rarity: "Élite" },
    { id: "f12", name: "Casemiro (Fict)", position: "MCD", nationality: "Brasil", club: "Samba FC", grl: 83, rarity: "Especial" },
    { id: "f13", name: "Bukayo Saka (Fict)", position: "ED", nationality: "Inglaterra", club: "London Gun", grl: 87, rarity: "Élite" }
];

// Estado global de la aplicación
let plantillaActual = {}; // Almacenará { posición: objetoJugador }
let misMonedas = 50000;

// ==========================================
// 2. ECONOMÍA: CÁLCULO DE VALOR DE MERCADO
// ==========================================
function calcularPrecio(grl, rarity) {
    let basePrice = 100;
    
    if (grl >= 50 && grl <= 59) basePrice = 200;
    else if (grl >= 60 && grl <= 69) basePrice = 500;
    else if (grl >= 70 && grl <= 79) basePrice = 1500;
    else if (grl >= 80 && grl <= 84) basePrice = 5000;
    else if (grl >= 85 && grl <= 89) basePrice = 20000;
    else if (grl >= 90 && grl <= 94) basePrice = 75000;
    else if (grl >= 95 && grl <= 99) basePrice = 300000;
    else if (grl >= 100) basePrice = 600000;

    // Multiplicadores por rareza para equilibrar
    const multiplicadores = { "Común": 1.0, "Especial": 1.2, "Élite": 1.5, "Ícono": 2.2 };
    const mult = multiplicadores[rarity] || 1.0;

    return Math.round(basePrice * mult);
}

// ==========================================
// 3. RENDERIZADO DE CARTAS E INTERFAZ
// ==========================================
function crearCardHTML(jugador, enMercado = true) {
    const precio = calcularPrecio(jugador.grl, jugador.rarity);
    
    // Colores dinámicos según rareza
    let borderColor = "border-slate-700 bg-slate-800";
    let textRarityColor = "text-slate-400";
    if (jugador.rarity === "Especial") { borderColor = "border-sky-500 bg-slate-900"; textRarityColor = "text-sky-400"; }
    if (jugador.rarity === "Élite") { borderColor = "border-amber-500 bg-gradient-to-b from-slate-900 to-amber-950/40"; textRarityColor = "text-amber-400"; }
    if (jugador.rarity === "Ícono") { borderColor = "border-yellow-400 bg-gradient-to-b from-slate-900 to-yellow-950"; textRarityColor = "text-yellow-400 font-bold animate-pulse"; }

    return `
        <div class="card p-3 border-2 ${borderColor} rounded-xl shadow-md flex flex-col justify-between text-center select-none cursor-pointer transform hover:-translate-y-1 transition-all duration-200" onclick="interactuarJugador('${jugador.id}')">
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xl font-black">${jugador.grl}</span>
                    <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-black/40 rounded">${jugador.position}</span>
                </div>
                <p class="font-bold text-sm truncate">${jugador.name}</p>
                <p class="text-[10px] ${textRarityColor}">${jugador.rarity}</p>
            </div>
            ${enMercado ? `<div class="mt-2 text-xs font-bold text-yellow-400 bg-black/30 py-1 rounded">🪙 ${precio.toLocaleString()}</div>` : ''}
        </div>
    `;
}

function actualizarMercado() {
    const container = document.getElementById('market-list');
    container.innerHTML = dbJugadoresFicticios.map(j => crearCardHTML(j, true)).join('');
}

// ==========================================
// 4. LÓGICA DE GESTIÓN DE PLANTILLA Y GRL
// ==========================================
function interactuarJugador(id) {
    const jugador = dbJugadoresFicticios.find(j => j.id === id);
    if (!jugador) return;

    // Buscar una posición compatible libre en el campo de juego
    const slots = document.querySelectorAll('.slot');
    let posAsignada = null;

    for (let slot of slots) {
        const slotPos = slot.getAttribute('data-pos');
        const acceptType = slot.getAttribute('data-accept') || slotPos;

        // Validar compatibilidad de posición
        if (acceptType === jugador.position && !plantillaActual[slotPos]) {
            posAsignada = slotPos;
            break;
        }
    }

    if (posAsignada) {
        plantillaActual[posAsignada] = jugador;
        // Colocar la carta visualmente en el campo
        const targetSlot = document.querySelector(`[data-pos="${posAsignada}"]`);
        targetSlot.innerHTML = crearCardHTML(jugador, false);
        actualizarEstadisticasEquipo();
    } else {
        alert(`No hay espacio libre o compatible para un ${jugador.position} en la cancha.`);
    }
}

function actualizarEstadisticasEquipo() {
    const jugadoresEnCancha = Object.values(plantillaActual);
    const count = jugadoresEnCancha.length;
    
    document.getElementById('team-count').innerText = `${count}/11`;

    if (count === 0) {
        document.getElementById('team-grl').innerText = "0";
        return;
    }

    // Calcular GRL Promedio exacto
    const sumaGrl = jugadoresEnCancha.reduce((sum, j) => sum + j.grl, 0);
    const promedio = Math.round(sumaGrl / count);
    
    document.getElementById('team-grl').innerText = promedio;
}

// ==========================================
// 5. CINEMÁTICA ESPECTACULAR "ÍCONO"
// ==========================================
function triggerIconAnimation(jugador) {
    const overlay = document.getElementById('icon-pack-opener');
    const stage = document.getElementById('icon-card-stage');
    const placeholder = document.getElementById('icon-card-placeholder');
    const closeBtn = document.getElementById('close-animation');

    placeholder.innerHTML = crearCardHTML(jugador, false);
    overlay.classList.remove('hidden');
    
    // Paso 1: Oscurecer y preparar escenario
    setTimeout(() => {
        overlay.classList.add('opacity-100');
        document.body.classList.add('shake-effect'); // Vibración de pantalla activa
    }, 50);

    // Paso 2: Zoom in cinematográfico de la carta
    setTimeout(() => {
        stage.classList.remove('scale-75');
        stage.classList.add('scale-110');
    }, 1000);

    // Paso 3: Detener vibración y habilitar salida
    setTimeout(() => {
        document.body.classList.remove('shake-effect');
        closeBtn.classList.remove('hidden');
    }, 3000);
}

// Simulación de apertura de sobre aleatorio
document.getElementById('btn-pack').addEventListener('click', () => {
    const azar = Math.random();
    let jugadorObtenido;

    if (azar > 0.85) {
        // 15% Probabilidad de Ícono
        const iconos = dbJugadoresFicticios.filter(j => j.rarity === "Ícono");
        jugadorObtenido = iconos[Math.floor(Math.random() * iconos.length)];
        triggerIconAnimation(jugadorObtenido);
    } else {
        // Cartas normales
        const normales = dbJugadoresFicticios.filter(j => j.rarity !== "Ícono");
        jugadorObtenido = normales[Math.floor(Math.random() * normales.length)];
        alert(`¡Obtuviste a ${jugadorObtenido.name} (${jugadorObtenido.grl})! Agrégalo desde tu inventario haciendo clic en él.`);
    }
});

document.getElementById('close-animation').addEventListener('click', () => {
    const overlay = document.getElementById('icon-pack-opener');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('hidden');
    document.getElementById('icon-card-stage').className = "text-center z-10 transform scale-75 transition-transform duration-1000 ease-out";
    document.getElementById('close-animation').classList.add('hidden');
});

// Inicializar la App
actualizarMercado();
