const questions = [];
const audioBenar = document.getElementById('sound-benar');
const audioSalah = document.getElementById('sound-salah');
const audioSelamat = document.getElementById('sound-sukses');
const audioGameOver = document.getElementById('sound-gagal');
const audioWaktuHabis = document.getElementById('sound-habis');
for (let i = 6; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
        questions.push({ a: i, b: j, answer: i * j });
    }
}

// Shuffle questions
for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
}

let current = 0;
let timer = null;
let timeLeft = 10;
let score = 0;

const soalDiv = document.getElementById('soal');
const input = document.getElementById('jawaban');
const timerSpan = document.getElementById('timer');
const scoreSpan = document.getElementById('score');
const btnKirim = document.getElementById('kirim-jawaban');

// Tambahkan elemen untuk nomor soal di atas soal
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

// Tombol level 2 dan ulang level 1
let nextLevelBtn = document.getElementById('next-level-btn');
if (!nextLevelBtn) {
    nextLevelBtn = document.createElement('button');
    nextLevelBtn.id = 'next-level-btn';
    nextLevelBtn.textContent = 'Ke Level 3';
    nextLevelBtn.style.display = 'none';
    nextLevelBtn.style.marginTop = '16px';
    soalDiv.parentNode.appendChild(nextLevelBtn);
}

let retryBtn = document.getElementById('retry-btn');
if (!retryBtn) {
    retryBtn = document.createElement('button');
    retryBtn.id = 'retry-btn';
    retryBtn.textContent = 'Ulangi Level 2';
    retryBtn.style.display = 'none';
    retryBtn.style.marginTop = '16px';
    soalDiv.parentNode.appendChild(retryBtn);
}
function stopAllAudio() {
  const audios = document.querySelectorAll("audio");
  audios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}
function showQuestion() {
    clearInterval(timer); // Hentikan timer sebelum tampil soal baru

    if (current >= questions.length) {
        stopAllAudio();
        nomorSoalDiv.textContent = '';
        soalDiv.textContent = '';
        input.style.display = 'none';
        btnKirim.style.display = 'none';
        timerSpan.textContent = '';
        selesaiDiv.style.display = 'block';
        localStorage.setItem('skor_level2', score);

        selesaiDiv.innerHTML = `
            <h2>Level 2 Selesai</h2>
            <p>Skor Akhir: <strong>${score}</strong></p>
        `;

        if (score >= 70) {
            localStorage.setItem('level2_numerasi_selesai', 'true');
            setTimeout(() => {
            audioSelamat.currentTime = 0;
            audioSelamat.play();
            }, 1000); // Tunggu 1 detik

            selesaiDiv.innerHTML += `<p>🎉 Selamat! Kamu bisa lanjut ke level berikutnya.</p>`;
            nextLevelBtn.style.display = 'inline-block';
            retryBtn.style.display = 'none';
            const level3Btn = document.querySelector('.level-btn[data-level="3"]');
            if (level3Btn) {
                level3Btn.classList.remove('disabled');
                localStorage.setItem('level2_selesai', 'true'); // Simpan di localStorage
            }
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
    timeLeft = 10;
    timerSpan.textContent = timeLeft;
    input.style.display = '';
    btnKirim.style.display = '';
    nextLevelBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    selesaiDiv.style.display = 'none';
    input.focus();
    startTimer(); // Pindahkan ke sini supaya pasti dipanggil setelah tampil soal
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
        score += 2;
        scoreSpan.textContent = score;
        audioBenar.currentTime = 0; audioBenar.play();
        setTimeout(nextQuestion, 1000);
    } else {
        soalDiv.textContent = `Salah! Jawaban seharusnya: ${q.answer}`;
        audioSalah.currentTime = 0; audioSalah.play();
        setTimeout(nextQuestion, 1500);
    }
}

input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !input.disabled) {
        checkAnswer();
    }
});

btnKirim.addEventListener('click', function () {
    if (!input.disabled) {
        checkAnswer();
    }
});

function startTimer() {
    clearInterval(timer); // FIX: pastikan timer tidak ganda
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
    clearInterval(timer); // Reset timer jika masih aktif
    score = 0;
    scoreSpan.textContent = score;
    current = 0;
    selesaiDiv.style.display = 'none';
    nextLevelBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    input.style.display = '';
    btnKirim.style.display = '';
    showQuestion(); // ini otomatis akan startTimer juga
}

// Tombol ke level 3
nextLevelBtn.onclick = function () {
    window.location.href = 'level3_numerasi.html';
};

// Tombol ulang level 1
retryBtn.onclick = function () {
    startGame();
};

startGame();

function stopAllAudio() {
    [audioBenar, audioSalah, audioSelamat, audioGameOver].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}
document.querySelector(".btn-exit")?.addEventListener("click", () => {
  if (confirm("Keluar dari permainan?")) {
    window.location.href = "numerasi.html";
  }
});
