document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    loginBtn.addEventListener("click", () => {
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
        loginForm.classList.add("active-form");
        signupForm.classList.remove("active-form");
    });

    signupBtn.addEventListener("click", () => {
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
        signupForm.classList.add("active-form");
        loginForm.classList.remove("active-form");
    });
});
