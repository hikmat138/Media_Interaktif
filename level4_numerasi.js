const questions = [];
const audioBenar = document.getElementById('sound-benar');
const audioSalah = document.getElementById('sound-salah');
const audioSelamat = document.getElementById('sound-sukses');
const audioGameOver = document.getElementById('sound-gagal');
const audioWaktuHabis = document.getElementById('sound-habis');

// Soal: 10 soal acak (1–5 × 10–59 atau 10–59 × 1–5)
for (let i = 0; i < 10; i++) {
  let a, b;
  if (Math.random() < 0.5) {
    a = Math.floor(Math.random() * 4) + 6;
    b = Math.floor(Math.random() * 50) + 10;
  } else {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * 4) + 6;
  }
  questions.push({ a, b, answer: a * b });
}

// Shuffle
for (let i = questions.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [questions[i], questions[j]] = [questions[j], questions[i]];
}

let current = 0;
let timer = null;
let timeLeft = 30;
let score = 0;

const soalDiv = document.getElementById('soal');
const input = document.getElementById('jawaban');
const timerSpan = document.getElementById('timer');
const scoreSpan = document.getElementById('score');
const btnKirim = document.getElementById('kirim-jawaban');

// Tambahkan elemen nomor soal
let nomorSoalDiv = document.getElementById('nomor-soal');
if (!nomorSoalDiv) {
  nomorSoalDiv = document.createElement('div');
  nomorSoalDiv.id = 'nomor-soal';
  nomorSoalDiv.style.fontWeight = 'bold';
  nomorSoalDiv.style.marginBottom = '8px';
  nomorSoalDiv.style.fontSize = '1.5em';
  soalDiv.parentNode.insertBefore(nomorSoalDiv, soalDiv);
}

// Elemen selesai
let selesaiDiv = document.getElementById('level-numerasi-selesai');
if (!selesaiDiv) {
  selesaiDiv = document.createElement('div');
  selesaiDiv.id = 'level-numerasi-selesai';
  selesaiDiv.style.display = 'none';
  soalDiv.parentNode.appendChild(selesaiDiv);
}

// Tombol
let nextLevelBtn = document.getElementById('next-level-btn');
if (!nextLevelBtn) {
  nextLevelBtn = document.createElement('button');
  nextLevelBtn.id = 'next-level-btn';
  nextLevelBtn.textContent = 'Ke Level 5';
  nextLevelBtn.style.display = 'none';
  nextLevelBtn.style.marginTop = '16px';
  soalDiv.parentNode.appendChild(nextLevelBtn);
}

let retryBtn = document.getElementById('retry-btn');
if (!retryBtn) {
  retryBtn = document.createElement('button');
  retryBtn.id = 'retry-btn';
  retryBtn.textContent = 'Ulangi Level 4';
  retryBtn.style.display = 'none';
  retryBtn.style.marginTop = '16px';
  soalDiv.parentNode.appendChild(retryBtn);
}

// Stop semua audio (agar tidak tumpang tindih)
function stopAllAudio() {
  [audioBenar, audioSalah, audioSelamat, audioGameOver, audioWaktuHabis].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
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
    localStorage.setItem('skor_level4', score);

    selesaiDiv.innerHTML = `
      <h2>Level 4 Selesai</h2>
      <p>Skor Akhir: <strong>${score}</strong></p>
    `;

    if (score >= 70) {
      localStorage.setItem('level4_numerasi_selesai', 'true');
      setTimeout(() => {
        audioSelamat.currentTime = 0;
        audioSelamat.play();
      }, 1000);
      selesaiDiv.innerHTML += `<p>🎉 Selamat! Kamu bisa lanjut ke level berikutnya.</p>`;
      nextLevelBtn.style.display = 'inline-block';
      retryBtn.style.display = 'none';

      // Aktifkan tombol level 4 di halaman utama jika ada
      const level4Btn = document.querySelector('.level-btn[data-level="4"]');
      if (level4Btn) level4Btn.classList.remove('disabled');

    } else {
      setTimeout(() => {
        audioGameOver.currentTime = 0;
        audioGameOver.play();
      }, 1000);
      selesaiDiv.innerHTML += `<p>😞 Skor belum cukup. Silakan coba lagi.</p>`;
      retryBtn.style.display = 'inline-block';
      nextLevelBtn.style.display = 'none';
    }

    return;
  }

  const q = questions[current];
  nomorSoalDiv.textContent = `Soal ${current + 1}`;
  soalDiv.textContent = `${q.a} x ${q.b} = ?`;
  input.value = '';
  input.disabled = false;
  btnKirim.disabled = false;
  timeLeft = 30;
  timerSpan.textContent = timeLeft;
  input.style.display = '';
  btnKirim.style.display = '';
  nextLevelBtn.style.display = 'none';
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
    score += 10;
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
  nextLevelBtn.style.display = 'none';
  retryBtn.style.display = 'none';
  input.style.display = '';
  btnKirim.style.display = '';
  showQuestion();
}

nextLevelBtn.onclick = () => {
  window.location.href = 'level5_numerasi.html';
};
retryBtn.onclick = () => {
  startGame();
};

document.querySelector(".btn-exit")?.addEventListener("click", () => {
  if (confirm("Keluar dari permainan?")) {
    window.location.href = "numerasi.html";
  }
});

startGame();
