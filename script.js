// 1. IMPORT FIREBASE (Tambahkan 'signOut' disini)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// 2. KONFIGURASI FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAzVJETWz1aP1uA0mXCdyJAr7OE9um1qNk",
  authDomain: "capstoneproject-9ada2.firebaseapp.com",
  projectId: "capstoneproject-9ada2",
  storageBucket: "capstoneproject-9ada2.firebasestorage.app",
  messagingSenderId: "1076034543928",
  appId: "1:1076034543928:web:9c336b1cf0376514aa61cd",
  measurementId: "G-9VD6EW1DEW",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 3. LOGIKA UTAMA
document.addEventListener("DOMContentLoaded", () => {
  // --- A. Navigasi Login <-> Register ---
  const loginFormContainer = document.getElementById("login-form-container");
  const registerFormContainer = document.getElementById(
    "register-form-container"
  );
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  if (showRegisterLink && showLoginLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginFormContainer.classList.add("d-none");
      registerFormContainer.classList.remove("d-none");
    });

    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      registerFormContainer.classList.add("d-none");
      loginFormContainer.classList.remove("d-none");
    });
  }

  // --- B. Fungsi LOGIN dengan GOOGLE ---
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Simpan info user ke LocalStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );

      alert(`Login Berhasil! Halo, ${user.displayName}`);
      window.location.href = "home.html";
    } catch (error) {
      console.error("Error Login:", error);
      alert(`Gagal Login: ${error.message}`);
    }
  };

  const googleLoginBtn = document.getElementById("google-login-btn");
  const googleRegisterBtn = document.getElementById("google-register-btn");

  if (googleLoginBtn)
    googleLoginBtn.addEventListener("click", handleGoogleLogin);
  if (googleRegisterBtn)
    googleRegisterBtn.addEventListener("click", handleGoogleLogin);

  // --- C. Login Manual ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userFound = users.find(
        (user) => user.username === username && user.password === password
      );

      if (userFound) {
        localStorage.setItem("currentUser", JSON.stringify({ name: username }));
        alert(`Login berhasil! Selamat datang, ${username}!`);
        window.location.href = "home.html";
      } else {
        alert("Username atau password salah!");
      }
    });
  }

  // --- D. Register Manual ---
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById(
        "reg-confirm-password"
      ).value;

      if (password !== confirmPassword) {
        alert("Password tidak cocok!");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find((user) => user.username === username)) {
        alert("Username sudah digunakan!");
        return;
      }

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registrasi berhasil! Silakan login.");

      registerFormContainer.classList.add("d-none");
      loginFormContainer.classList.remove("d-none");
      registerForm.reset();
    });
  }

  // --- E. LOGIKA LOGOUT (DIPERBARUI) ---
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (confirm("Apakah Anda yakin ingin logout?")) {
        // 1. Logout dari Firebase
        signOut(auth)
          .then(() => {
            // 2. Hapus data di LocalStorage
            localStorage.removeItem("currentUser");
            // 3. Redirect ke Login
            window.location.href = "login.html";
          })
          .catch((error) => {
            console.error("Error Logout:", error);
            // Tetap paksa logout lokal jika firebase error
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
          });
      }
    });
  }

  // --- F. LOGIKA REKOMENDASI PRODUK (SISTEM CERDAS) ---

  // 1. Logic di Halaman Recommendation.html
  const btnCheckRec = document.getElementById("btn-check-recommendation");
  if (btnCheckRec) {
    btnCheckRec.addEventListener("click", () => {
      // Ambil nilai input user
      const name = document.getElementById("rec-name").value;
      const budget = document.getElementById("rec-budget").value;

      // Validasi sederhana
      if (!budget) {
        alert("Mohon pilih budget Anda terlebih dahulu.");
        return;
      }

      // LOGIKA PENENTUAN PAKET (Sederhana berdasarkan Budget)
      let recommendedPackage = "";

      if (budget === "economy") {
        recommendedPackage = "basic"; // Paket Murah
      } else if (budget === "standard") {
        recommendedPackage = "gamer"; // Paket Menengah
      } else {
        recommendedPackage = "business"; // Paket Mahal
      }

      // Simpan hasil ke LocalStorage
      const recommendationResult = {
        user: name || "Pengguna",
        type: recommendedPackage,
        timestamp: new Date().getTime(),
      };

      localStorage.setItem(
        "telcoRecommendation",
        JSON.stringify(recommendationResult)
      );

      alert(
        `Rekomendasi berhasil dibuat untuk ${
          name || "Anda"
        }! Mengalihkan ke halaman Home...`
      );
      window.location.href = "home.html#products"; // Redirect ke Home bagian produk
    });
  }

  // 2. Logic di Halaman Home.html (Menampilkan Hasil)
  const dynamicProductContainer = document.getElementById(
    "dynamic-product-container"
  );

  if (dynamicProductContainer) {
    // Cek apakah ada data rekomendasi di LocalStorage
    const savedData = localStorage.getItem("telcoRecommendation");

    if (!savedData) {
      // KONDISI A: USER BELUM MENGISI FORM (Tampilkan Ajakan)
      document.getElementById("product-title").innerText =
        "Bingung Memilih Paket?";
      document.getElementById("product-subtitle").innerText =
        "Gunakan fitur rekomendasi cerdas kami untuk menemukan paket yang paling pas.";

      dynamicProductContainer.innerHTML = `
                <div class="feature-card" style="grid-column: 1 / -1; max-width: 600px; margin: 0 auto; background: #fff;">
                    <div class="icon-box">
                        <i class="bi bi-magic"></i>
                    </div>
                    <h3>Cari Tahu Kebutuhanmu</h3>
                    <p>Jawab beberapa pertanyaan singkat tentang kebiasaan internetmu, dan AI kami akan memilihkan paket terbaik.</p>
                    <br>
                    <a href="recommendation.html" class="btn btn-primary rounded-pill" style="width: fit-content; margin: 0 auto;">Mulai Rekomendasi</a>
                </div>
            `;
    } else {
      // KONDISI B: USER SUDAH MENGISI FORM (Tampilkan Hasil Spesifik)
      const data = JSON.parse(savedData);

      // Ubah judul agar personal
      document.getElementById(
        "product-title"
      ).innerText = `Rekomendasi untuk ${data.user}`;
      document.getElementById("product-subtitle").innerText =
        "Berdasarkan analisis kebutuhan telekomunikasi Anda.";

      // Siapkan Data Paket (Database Mini)
      let cardsHTML = "";

      // Paket 1: Basic (Economy)
      const cardBasic = `
                <div class="product-card ${
                  data.type === "basic" ? "highlight" : ""
                }">
                    ${
                      data.type === "basic"
                        ? '<div class="badge">Sangat Cocok</div>'
                        : ""
                    }
                    <i class="bi bi-router product-icon"></i>
                    <h3>Home Fiber 50</h3>
                    <p class="speed">Up to 50 Mbps</p>
                    <ul class="feature-list">
                        <li><i class="bi bi-check"></i> Unlimited Kuota</li>
                        <li><i class="bi bi-check"></i> Cocok untuk Browsing</li>
                        <li><i class="bi bi-check"></i> Harga Ekonomis</li>
                    </ul>
                    <div class="price">Rp 250.000<small>/bulan</small></div>
                    <button class="btn-product ${
                      data.type === "basic" ? "primary" : ""
                    }">Pilih Paket</button>
                </div>`;

      // Paket 2: Gamer (Standard)
      const cardGamer = `
                <div class="product-card ${
                  data.type === "gamer" ? "highlight" : ""
                }">
                    ${
                      data.type === "gamer"
                        ? '<div class="badge">Sangat Cocok</div>'
                        : ""
                    }
                    <i class="bi bi-lightning-charge product-icon"></i>
                    <h3>Gamer Pro 100</h3>
                    <p class="speed">Up to 100 Mbps</p>
                    <ul class="feature-list">
                        <li><i class="bi bi-check"></i> Latency Rendah (Gaming)</li>
                        <li><i class="bi bi-check"></i> Streaming 4K Lancar</li>
                        <li><i class="bi bi-check"></i> Free Voucher Game</li>
                    </ul>
                    <div class="price">Rp 450.000<small>/bulan</small></div>
                    <button class="btn-product ${
                      data.type === "gamer" ? "primary" : ""
                    }">Pilih Paket</button>
                </div>`;

      // Paket 3: Business (Premium)
      const cardBusiness = `
                <div class="product-card ${
                  data.type === "business" ? "highlight" : ""
                }">
                    ${
                      data.type === "business"
                        ? '<div class="badge">Sangat Cocok</div>'
                        : ""
                    }
                    <i class="bi bi-briefcase product-icon"></i>
                    <h3>Business Ultra</h3>
                    <p class="speed">Up to 300 Mbps</p>
                    <ul class="feature-list">
                        <li><i class="bi bi-check"></i> Prioritas Bandwidth</li>
                        <li><i class="bi bi-check"></i> Upload Cepat</li>
                        <li><i class="bi bi-check"></i> Cloud Storage 1TB</li>
                    </ul>
                    <div class="price">Rp 950.000<small>/bulan</small></div>
                    <button class="btn-product ${
                      data.type === "business" ? "primary" : ""
                    }">Pilih Paket</button>
                </div>`;

      // LOGIKA TAMPILAN:
      // Kita hanya menampilkan paket yang cocok saja (agar fokus),
      // ATAU menampilkan semua tapi yang cocok di-highlight.
      // Di sini saya buat menampilkan semua tapi yang cocok ada di tengah & highlight.

      if (data.type === "basic") {
        // Jika Rekomendasi = Basic
        // Urutan: Gamer - BASIC (Tengah) - Business
        cardsHTML = cardGamer + cardBasic + cardBusiness;
      } else if (data.type === "gamer") {
        // Jika Rekomendasi = Gamer
        // Urutan: Basic - GAMER (Tengah) - Business
        cardsHTML = cardBasic + cardGamer + cardBusiness;
      } else {
        // Jika Rekomendasi = Business
        // Urutan: Basic - BUSINESS (Tengah) - Gamer
        cardsHTML = cardBasic + cardBusiness + cardGamer;
      }

      // Opsi Tambahan: Tombol Reset (Untuk tes ulang)
      const resetButton = `
                <div style="grid-column: 1/-1; text-align: center; margin-top: 20px;">
                    <small><a href="#" id="reset-rec" style="color: #666; text-decoration: underline;">Cari rekomendasi ulang</a></small>
                </div>
            `;

      dynamicProductContainer.innerHTML = cardsHTML + resetButton;

      // Event listener untuk reset
      document.getElementById("reset-rec").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("telcoRecommendation");
        location.reload();
      });
    }
  }
});
