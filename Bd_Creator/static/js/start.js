document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const introText = document.getElementById("introText");
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");

        if (introText) {
            introText.classList.add("hidden");
        }
        
        setTimeout(() => {
            if (loginForm) {
                loginForm.classList.add("show");
            }
            if (registerForm) {
                registerForm.classList.add("show");
            }
        }, 250);
    }, 250);
});