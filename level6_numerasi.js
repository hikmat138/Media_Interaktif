// level6_numerasi.js

const questions = [];
const audioBenar = document.getElementById('sound-benar');
const audioSalah = document.getElementById('sound-salah');
const audioSelamat = document.getElementById('sound-sukses');
const audioGameOver = document.getElementById('sound-gagal');
const audioWaktuHabis = document.getElementById('sound-habis');

// Soal: 10 soal acak (1–5 × 10–59 atau 10–59 × 1–5)
for (let i = 0; i < 4; i++) {
  const a = (Math.floor(Math.random() * 4) + 6) * 10 + (Math.floor(Math.random() * 5) + 1);
  const b = (Math.floor(Math.random() * 4) + 6) * 10 + (Math.floor(Math.random() * 5) + 1);
  questions.push({ a, b, answer: a * b });
}

// Shuffle
for (let i = questions.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [questions[i], questions[j]] = [questions[j], questions[i]];
}

let current = 0;
let timer = null;
let timeLeft = 90;
let score = 0;

const soalDiv = document.getElementById('soal');
const input = document.getElementById('jawaban');
const timerSpan = document.getElementById('timer');
const scoreSpan = document.getElementById('score');
const btnKirim = document.getElementById('kirim-jawaban');

let nomorSoalDiv = document.getElementById('nomor-soal');
if (!nomorSoalDiv) {
  nomorSoalDiv = document.createElement('div');
  nomorSoalDiv.id = 'nomor-soal';
  nomorSoalDiv.style.fontWeight = 'bold';
  nomorSoalDiv.style.marginBottom = '8px';
  nomorSoalDiv.style.fontSize = '1.5em';
  soalDiv.parentNode.insertBefore(nomorSoalDiv, soalDiv);
}

let selesaiDiv = document.getElementById('level-numerasi-selesai');
if (!selesaiDiv) {
  selesaiDiv = document.createElement('div');
  selesaiDiv.id = 'level-numerasi-selesai';
  selesaiDiv.style.display = 'none';
  soalDiv.parentNode.appendChild(selesaiDiv);
}

let retryBtn = document.getElementById('retry-btn');
if (!retryBtn) {
  retryBtn = document.createElement('button');
  retryBtn.id = 'retry-btn';
  retryBtn.textContent = 'Ulangi Level 6';
  retryBtn.style.display = 'none';
  retryBtn.style.marginTop = '16px';
  soalDiv.parentNode.appendChild(retryBtn);
}

function stopAllAudio() {
  [audioBenar, audioSalah, audioSelamat, audioGameOver, audioWaktuHabis].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function tampilkanRataRataDanKembali() {
  const nama = localStorage.getItem('nama_pengguna') || 'Pengguna';
  const skor1 = parseInt(localStorage.getItem('skor_level1')) || 0;
  const skor2 = parseInt(localStorage.getItem('skor_level2')) || 0;
  const skor3 = parseInt(localStorage.getItem('skor_level3')) || 0;
  const skor4 = parseInt(localStorage.getItem('skor_level4')) || 0;
  const skor5 = parseInt(localStorage.getItem('skor_level5')) || 0;
  const skor6 = score;
  const rataRata = Math.round((skor1 + skor2 + skor3 + skor4 + skor5 + skor6) / 6);

  selesaiDiv.innerHTML += `
    <p>👨‍🎓 Rata-rata Skor dari semua level: <strong>${rataRata}</strong></p>
    <p>Terima kasih sudah bermain, ${nama}!</p>
  `;

  setTimeout(() => {
    window.location.href = 'numerasi.html';
  }, 6000);
}

function showQuestion() {
  clearInterval(timer);
  if (current >= questions.length) {
    stopAllAudio();
    nomorSoalDiv.textContent = '';
    soalDiv.textContent = '';
    input.style.display = 'none';
    btnKirim.style.display = 'none';
    timerSpan.textContent = '';
    selesaiDiv.style.display = 'block';
    localStorage.setItem('skor_level6', score);

    selesaiDiv.innerHTML = `
      <h2>Level 6 Selesai</h2>
      <p>Skor Akhir: <strong>${score}</strong></p>
    `;

    if (score >= 70) {
      localStorage.setItem('level6_numerasi_selesai', 'true');
      setTimeout(() => {
        audioSelamat.currentTime = 0;
        audioSelamat.play();
      }, 1000);
      selesaiDiv.innerHTML += `<p>🎉 Selamat! Kamu telah menyelesaikan semua level.</p>`;
      tampilkanRataRataDanKembali();
    } else {
      setTimeout(() => {
        audioGameOver.currentTime = 0;
        audioGameOver.play();
      }, 1000);
      selesaiDiv.innerHTML += `<p>😞 Skor belum cukup. Silakan coba lagi.</p>`;
      retryBtn.style.display = 'inline-block';
    }

    return;
  }

  const q = questions[current];
  nomorSoalDiv.textContent = `Soal ${current + 1}`;
  soalDiv.textContent = `${q.a} x ${q.b} = ?`;
  input.value = '';
  input.disabled = false;
  btnKirim.disabled = false;
  timeLeft = 90;
  timerSpan.textContent = timeLeft;
  input.style.display = '';
  btnKirim.style.display = '';
  retryBtn.style.display = 'none';
  selesaiDiv.style.display = 'none';
  input.focus();
  startTimer();
}

function nextQuestion() {
  current++;
  showQuestion();
}

function checkAnswer() {
  input.disabled = true;
  btnKirim.disabled = true;
  clearInterval(timer);

  const q = questions[current];
  if (parseInt(input.value) === q.answer) {
    soalDiv.textContent = 'Benar!';
    score += 25;
    scoreSpan.textContent = score;
    audioBenar.currentTime = 0;
    audioBenar.play();
    setTimeout(nextQuestion, 1000);
  } else {
    soalDiv.textContent = `Salah! Jawaban seharusnya: ${q.answer}`;
    audioSalah.currentTime = 0;
    audioSalah.play();
    setTimeout(nextQuestion, 1500);
  }
}

input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !input.disabled) checkAnswer();
});
btnKirim.addEventListener('click', function () {
  if (!input.disabled) checkAnswer();
});

function startTimer() {
  clearInterval(timer);
  timerSpan.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      input.disabled = true;
      btnKirim.disabled = true;
      const q = questions[current];
      soalDiv.textContent = `Waktu habis! Jawaban: ${q.answer}`;
      audioWaktuHabis.currentTime = 0;
      audioWaktuHabis.play();
      setTimeout(nextQuestion, 1500);
    }
  }, 1000);
}

function startGame() {
  clearInterval(timer);
  score = 0;
  scoreSpan.textContent = score;
  current = 0;
  selesaiDiv.style.display = 'none';
  retryBtn.style.display = 'none';
  input.style.display = '';
  btnKirim.style.display = '';
  showQuestion();
}

retryBtn.onclick = () => {
  startGame();
};

document.querySelector(".btn-exit")?.addEventListener("click", () => {
  if (confirm("Keluar dari permainan?")) {
    window.location.href = "numerasi.html";
  }
});

startGame();
