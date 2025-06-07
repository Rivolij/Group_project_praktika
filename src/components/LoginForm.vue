<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const login = ref('')
const password = ref('')
const error = ref('')
const loginError = ref('')
const passwordError = ref('')
const shakeLogin = ref(false)
const shakePassword = ref(false)

function triggerShake(field) {
  if (field === 'login') {
    shakeLogin.value = false
    setTimeout(() => (shakeLogin.value = true), 0)
  }
  if (field === 'password') {
    shakePassword.value = false
    setTimeout(() => (shakePassword.value = true), 0)
  }
}

function handleLogin() {
  error.value = ''
  loginError.value = ''
  passwordError.value = ''

  let hasError = false

  if (!login.value.trim()) {
    loginError.value = 'Введите логин'
    triggerShake('login')
    hasError = true
  }

  if (!password.value.trim()) {
    passwordError.value = 'Введите пароль'
    triggerShake('password')
    hasError = true
  }

  if (hasError) return

  const users = JSON.parse(localStorage.getItem('users')) || []
  const user = users.find(u => u.login === login.value)

  if (!user) {
    error.value = 'Такой пользователь не зарегистрирован'
    triggerShake('login')
    return
  }

  if (user.password !== password.value) {
    error.value = 'Неверный пароль'
    triggerShake('password')
    return
  }

  // Успешный вход
  emit('login', {
    login: login.value,
    password: password.value
  })
}

</script>

<template>
  <div class="form">
    <h2>Вход</h2>

    <form @submit.prevent="handleLogin">
      <label for="login">Логин</label>
      <input
        id="login"
        v-model="login"
        :class="{ 'error-input': loginError, shake: shakeLogin }"
        placeholder="Введите логин"
      />
      <p v-if="loginError" class="error-message">{{ loginError }}</p>

      <label for="password">Пароль</label>
      <input
        id="password"
        v-model="password"
        type="password"
        :class="{ 'error-input': passwordError, shake: shakePassword }"
        placeholder="Введите пароль"
      />
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

      <p v-if="error" class="error-message">{{ error }}</p>

      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<style scoped>
.error-input {
  border-color: red !important;
}

@keyframes shake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-4px); }
  40%  { transform: translateX(4px); }
  60%  { transform: translateX(-4px); }
  80%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.3s ease;
}
.error-message {
  color: red;
  margin: -10px 0 10px;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(228, 239, 255, 1);
  padding: 20px;
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 180, 216, 0.2);
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
form label {
  margin-left: -210px;
}

h2 {
  color: rgba(0, 97, 148, 1);
  margin-bottom: 20px;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 6px;
  color: rgba(0, 97, 148, 1);
  font-weight: bold;
}

input {
  width: 250px;
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid rgba(136, 194, 254, 1);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: rgb(89, 155, 225);
}

button {
  width: 150px;
  padding: 10px;
  background-color: rgba(255, 196, 142, 1);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: rgb(255, 156, 43);
  color: rgb(255, 255, 255);
}

/* === стили для автозаполнения === */
::v-deep(input:-webkit-autofill),
::v-deep(input:-webkit-autofill:hover),
::v-deep(input:-webkit-autofill:focus),
::v-deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px rgb(255, 255, 255) !important;
  box-shadow: 0 0 0 1000px rgb(224, 255, 216) inset !important;
  -webkit-text-fill-color: #000 !important;
  transition: background-color 9999s ease-in-out 0s;
}
</style>
