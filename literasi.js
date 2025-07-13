// Popup Profil Modal
window.addEventListener("load", function () {
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

  // Aktifkan level yang sudah diselesaikan
  for (let i = 2; i <= 7; i++) {
    if (localStorage.getItem(`level${i - 1}_literasi_selesai`) === 'true') {
      const btn = document.querySelector(`.level-btn[data-level="${i}"]`);
      if (btn) btn.classList.remove('disabled');
    }
  }

  // Event listener tombol level
  document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("disabled")) {
        alert("Selesaikan level sebelumnya dulu ya!");
        return;
      }

      const level = btn.dataset.level;
      window.location.href = `level${level}_literasi.html`;
    });
  });
});

// Info Aplikasi
document.querySelector(".btn-information").onclick = () => {
  alert("Ini adalah media pembelajaran interaktif untuk siswa kelas 5 SD");
};
