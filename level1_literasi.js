// level1_literasi.js

const soalContainer = document.getElementById("soal");
const btnNext = document.getElementById("btn-next");
const skorSpan = document.getElementById("score");
const selesaiDiv = document.getElementById("akhir-container");
const namaPengguna = localStorage.getItem("nama_pengguna") || "Pengguna";
document.getElementById("nama-pengguna-label").textContent = namaPengguna;

const soalLiterasi = [
  { kata: "buku" },
  { kata: "meja" },
  { kata: "kursi" },
  { kata: "rumah" },
  { kata: "mobil" },
  { kata: "pisang" },
  { kata: "sapu" },
  { kata: "sepeda" },
  { kata: "belajar" },
  { kata: "perikemanusiaan" },
];

const pelafalanHuruf = {
  a: "a", b: "be", c: "ce", d: "de", e: "e", f: "ef", g: "ge", h: "ha",
  i: "i", j: "je", k: "ka", l: "el", m: "em", n: "en", o: "o", p: "pe", q: "ki",
  r: "er", s: "es", t: "te", u: "u", v: "fe", w: "we", x: "eks", y: "ye", z: "zet"
};

let current = 0;
let score = 0;
let recognition;

function getPelafalan(kata) {
  return kata.split('').map(h => pelafalanHuruf[h.toLowerCase()] || h).join('');
}

function tampilkanSoal() {
  soalContainer.innerHTML = "";
  const kata = soalLiterasi[current].kata;
  for (let huruf of kata) {
    const span = document.createElement("span");
    span.className = "huruf";
    span.textContent = huruf.toUpperCase();
    soalContainer.appendChild(span);
  }
  mulaiRekaman();
}

function mulaiRekaman() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("Browser tidak mendukung speech recognition.");
    return;
  }
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = function(event) {
    const hasil = event.results[0][0].transcript.toLowerCase().replace(/\s+/g, "");
    checkJawaban(hasil);
  };

  recognition.onerror = function(e) {
    console.warn("Error rekaman:", e);
  };

  recognition.start();
}

function checkJawaban(jawaban) {
  const kata = soalLiterasi[current].kata;
  const benar = getPelafalan(kata);
  const jawabanNormal = jawaban.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  console.log("Expected:", benar);
  console.log("Detected:", jawabanNormal);

  if (jawabanNormal.includes(benar)) {
    score += 10;
    skorSpan.textContent = score;
    soalContainer.querySelectorAll(".huruf").forEach(h => h.style.backgroundColor = "#28a745");
  } else {
    soalContainer.querySelectorAll(".huruf").forEach(h => h.style.backgroundColor = "#dc3545");
  }
  btnNext.style.display = "inline-block";
}

btnNext.addEventListener("click", () => {
  current++;
  if (current >= soalLiterasi.length) {
    selesai();
  } else {
    btnNext.style.display = "none";
    tampilkanSoal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnNext.click();
});

function selesai() {
  soalContainer.style.display = "none";
  btnNext.style.display = "none";
  selesaiDiv.style.display = "block";
  selesaiDiv.innerHTML = `
    <h2>Level 1 Literasi Selesai</h2>
    <p>Skor Akhir: <strong>${score}</strong></p>
  `;
  if (score >= 70) {
    localStorage.setItem("level1_literasi_selesai", "true");
    selesaiDiv.innerHTML += '<button class="button-success" onclick="window.location.href=\'level2_literasi.html\'">Lanjut ke Level 2</button>';
  } else {
    selesaiDiv.innerHTML += '<button class="button-fail" onclick="location.reload()">Ulangi Level 1</button>';
  }
}

// Mulai
skorSpan.textContent = 0;
btnNext.style.display = "none";
selesaiDiv.style.display = "none";
tampilkanSoal();
