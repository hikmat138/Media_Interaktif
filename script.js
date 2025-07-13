// Popup Profil Modal
window.addEventListener("load", function() {
    if (!localStorage.getItem("hkmtPopupShown")) {
      setTimeout(() => {
        document.getElementById("popup-profil").style.display = "flex";
        localStorage.setItem("hkmtPopupShown", "true");
      }, 1000);
    }
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".btn-profil")?.addEventListener("click", () => {
      document.getElementById("popup-profil").style.display = "flex";
    });
  
    document.getElementById("popup-close")?.addEventListener("click", () => {
      document.getElementById("popup-profil").style.display = "none";
    });
  });
  
  
   
  
  document.querySelector(".btn-information").onclick = () => {
    alert("Ini adalah media pembelajaran interaktif untuk siswa kelas 5 SD");
  };
  
 const musik = new Audio('media/musik.mp3');
musik.loop = true;

// Ambil status musik (play/pause) dari localStorage
const paused = localStorage.getItem('musikPaused') === 'true';
const lastTime = parseFloat(localStorage.getItem('musikTime')) || 0;

musik.currentTime = lastTime; // lanjut dari waktu terakhir

if (!paused) {
  musik.play();
}

// Tombol Play
document.querySelector('.btn-play')?.addEventListener('click', () => {
  musik.play();
  localStorage.setItem('musikPaused', 'false');
});

// Tombol Mute
document.querySelector('.btn-mute')?.addEventListener('click', () => {
  musik.pause();
  localStorage.setItem('musikPaused', 'true');
});

// Update posisi waktu setiap detik ke localStorage
setInterval(() => {
  if (!musik.paused) {
    localStorage.setItem('musikTime', musik.currentTime.toString());
  }
}, 1000);

/// Arahkan ke halaman numerasi saat tombol diklik
  const numerasiButton = document.querySelector(".btn-numerasi");
  numerasiButton?.addEventListener("click", () => {
    window.location.href = "numerasi.html";
  });
  
/// Arahkan ke halaman literasi saat tombol diklik
  const literasiButton = document.querySelector(".btn-literasi");
  literasiButton?.addEventListener("click", () => {
    window.location.href = "literasi.html";
  });
  document.getElementById("reset-nama-btn")?.addEventListener("click", () => {
  if (confirm("Yakin ingin mengganti nama pengguna?")) {
    localStorage.removeItem("nama_pengguna");
    location.reload(); // agar prompt nama muncul lagi
  }
});
