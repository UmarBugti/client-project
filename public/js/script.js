const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const switchToSignUp = document.getElementById('switchToSignUp');
const switchToLogin = document.getElementById('switchToLogin');

// Toggle to Sign-Up Form
switchToSignUp.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
});

// Toggle to Login Form
switchToLogin.addEventListener('click', () => {
    signUpForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});
