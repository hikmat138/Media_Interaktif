document.addEventListener("DOMContentLoaded", function () {
  const popupNama = document.getElementById("popup-nama");
  const inputNama = document.getElementById("input-nama");
  const btnSimpan = document.getElementById("btn-simpan-nama");

  // Cek apakah nama pengguna sudah tersimpan di localStorage
  const namaTersimpan = localStorage.getItem("nama_pengguna");

  if (namaTersimpan) {
    tampilkanNama(namaTersimpan);       // Tampilkan label
    popupNama.style.display = "none";   // Jangan tampilkan popup
  } else {
    popupNama.style.display = "flex";   // Tampilkan popup jika belum ada nama
  }

  // Ketika tombol "Mulai" ditekan
  btnSimpan.addEventListener("click", function () {
    const nama = inputNama.value.trim();
    if (nama !== "") {
      localStorage.setItem("nama_pengguna", nama);
      tampilkanNama(nama);
      popupNama.style.display = "none";
    } else {
      alert("Nama tidak boleh kosong!");
    }
  });

  // Fungsi menampilkan label nama pengguna di kiri atas
  function tampilkanNama(nama) {
    let namaLabel = document.getElementById("nama-pengguna-label");
    if (!namaLabel) {
      namaLabel = document.createElement("div");
      namaLabel.id = "nama-pengguna-label";
      namaLabel.style.position = "absolute";
      namaLabel.style.top = "20px";
      namaLabel.style.left = "30px";
      namaLabel.style.backgroundColor ="rgba(139, 199, 133, 0.8)";
      namaLabel.style.padding = "6px 12px";
      namaLabel.style.borderRadius = "12px";
      namaLabel.style.fontSize = "26px";
      namaLabel.style.boxShadow = "0 2px 6px rgba(15, 15, 197, 0.84)";
      namaLabel.style.zIndex = "999";
      document.body.appendChild(namaLabel);
    }
    namaLabel.textContent = `Nama: ${nama}`;
  }
});
