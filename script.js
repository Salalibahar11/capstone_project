document.addEventListener("DOMContentLoaded", () => {

    // --- Seleksi Elemen DOM ---
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // --- Logika untuk Berpindah Form ---

    // Saat link "Daftar di sini" diklik
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Gunakan kelas Bootstrap 'd-none' (display: none)
        loginFormContainer.classList.add('d-none');
        registerFormContainer.classList.remove('d-none');
    });

    // Saat link "Login di sini" diklik
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Gunakan kelas Bootstrap 'd-none'
        registerFormContainer.classList.add('d-none');
        loginFormContainer.classList.remove('d-none');
    });

    // --- Logika Proses Daftar (Register) ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Password dan Konfirmasi Password tidak cocok!');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.find(user => user.username === username);
        
        if (userExists) {
            alert('Username sudah digunakan!');
            return;
        }

        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registrasi berhasil! Silakan login.');

        // Pindahkan ke halaman login
        registerFormContainer.classList.add('d-none');
        loginFormContainer.classList.remove('d-none');
        registerForm.reset();
    });

    // --- Logika Proses Login ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const userFound = users.find(user => user.username === username && user.password === password);

        if (userFound) {
            alert(`Login berhasil! Selamat datang, ${username}!`);
            // Di aplikasi nyata, Anda akan mengarahkan user ke halaman dashboard
            // contoh: window.location.href = 'dashboard.html';
            loginForm.reset();
        } else {
            alert('Username atau password salah!');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    // ... (KODE LAMA ANDA TETAP DISINI: Login/Register logic) ...
    // Pastikan tidak menghapus kode logic form login/register sebelumnya.

    // --- Logika Logout (Untuk Halaman Home) ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Hapus data session (opsional)
            // localStorage.removeItem('currentUser'); 
            
            // Redirect kembali ke halaman index.html (Login)
            // Karena file home.html ada di folder src/, kita tetap di folder src/
            window.location.href = 'index.html'; 
        });
    }

    // --- Tambahan: Jika Login Berhasil, arahkan ke home.html ---
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            // ... Logika validasi user Anda sebelumnya ...
            
            // CONTOH Redirect setelah sukses login:
            // Ganti alert sukses Anda dengan ini:
            // window.location.href = 'home.html';
            
            // Untuk demo sekarang, kita pakai alert dulu:
            alert("Login Berhasil! (Silakan manual buka home.html atau atur redirect di script.js)");
             window.location.href = 'home.html'; // Uncomment ini agar otomatis pindah
        });
    }
});