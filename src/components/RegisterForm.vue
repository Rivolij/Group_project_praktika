<script setup>
import { ref } from 'vue'

const emit = defineEmits(['register-success', 'register-error'])

const user = ref({
  login: '',
  lastName: '',
  firstName: '',
  middleName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const agreement = ref(false)
const error = ref('')
const errors = ref({
  login: '',
  lastName: '',
  firstName: '',
  middleName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function isCyrillic(str) {
  return /^[А-Яа-яЁё\s-]+$/.test(str)
}

function isLatin(str) {
  return /^[A-Za-z0-9_]+$/.test(str)
}

function isValidEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
}

function validate() {
  let valid = true
  const u = user.value
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  errors.value = {
    login: '',
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  // Логин
  if (!u.login) {
    errors.value.login = 'Введите логин'
    valid = false
  } else if (!isLatin(u.login)) {
    errors.value.login = 'Логин должен содержать только латинские буквы и цифры'
    valid = false
  } else if (users.find(existing => existing.login === u.login)) {
    errors.value.login = 'Логин уже занят'
    valid = false
  }

  // Фамилия
  if (!u.lastName) {
    errors.value.lastName = 'Введите фамилию'
    valid = false
  } else if (!isCyrillic(u.lastName)) {
    errors.value.lastName = 'Фамилия должна быть на кириллице'
    valid = false
  }

  // Имя
  if (!u.firstName) {
    errors.value.firstName = 'Введите имя'
    valid = false
  } else if (!isCyrillic(u.firstName)) {
    errors.value.firstName = 'Имя должно быть на кириллице'
    valid = false
  }

  // Отчество
  if (!u.middleName) {
    errors.value.middleName = 'Введите отчество'
    valid = false
  } else if (!isCyrillic(u.middleName)) {
    errors.value.middleName = 'Отчество должно быть на кириллице'
    valid = false
  }

  // Email
  if (!u.email) {
    errors.value.email = 'Введите email'
    valid = false
  } else if (!isValidEmail(u.email)) {
    errors.value.email = 'Неверный формат email'
    valid = false
  }

  // Пароль
  if (!u.password) {
    errors.value.password = 'Введите пароль'
    valid = false
  }

  // Подтверждение пароля
  if (!u.confirmPassword) {
    errors.value.confirmPassword = 'Подтвердите пароль'
    valid = false
  } else if (u.password !== u.confirmPassword) {
    errors.value.confirmPassword = 'Пароли не совпадают'
    valid = false
  }

  return valid
}

function handleRegister() {
  error.value = ''
  if (!agreement.value) {
    error.value = 'Вы должны согласиться на обработку персональных данных'
    emit('register-error', error.value)
    return
  }

  if (!validate()) {
    emit('register-error', 'Ошибка валидации')
    return
  }

  const newUser = {
    login: user.value.login,
    lastName: user.value.lastName,
    firstName: user.value.firstName,
    middleName: user.value.middleName,
    email: user.value.email,
    password: user.value.password,
    role: 'user',
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))

  emit('register-success', newUser)
}
</script>


<template>
  <div class="form">
    <h2>Регистрация</h2>

    <div class="form-group">
      <label for="login">Логин</label>
      <div class="input-wrapper">
      <input id="login" v-model="user.login" placeholder="Введите логин" />
      <span class="field-error" v-if="errors.login">{{ errors.login }}</span>
    </div>
    </div>

    <div class="form-group">
      <label for="lastName">Фамилия</label>
      <div class="input-wrapper">
      <input id="lastName" v-model="user.lastName" placeholder="Иванова" />
      <span class="field-error" v-if="errors.lastName">{{ errors.lastName }}</span>
    </div>
    </div>

    <div class="form-group">
      <label for="firstName">Имя</label>
      <div class="input-wrapper">
      <input id="firstName" v-model="user.firstName" placeholder="Иван" />
      <span class="field-error" v-if="errors.firstName">{{ errors.firstName }}</span>
    </div>
    </div>

    <div class="form-group">
      <label for="middleName">Отчество</label>
      <div class="input-wrapper">
      <input id="middleName" v-model="user.middleName" placeholder="Иванович" />
      <span class="field-error" v-if="errors.middleName">{{ errors.middleName }}</span>
    </div>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <div class="input-wrapper">
      <input id="email" v-model="user.email" placeholder="ivanov@email.ru" />
      <span class="field-error" v-if="errors.email">{{ errors.email }}</span>
    </div>
    </div>

    <div class="form-group">
      <label for="password">Пароль</label>
      <div class="input-wrapper">
      <input id="password" v-model="user.password" type="password" placeholder="Введите пароль" />
      <span class="field-error" v-if="errors.password">{{ errors.password }}</span>
    </div>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Повторите пароль</label>
      <div class="input-wrapper">
      <input id="confirmPassword" v-model="user.confirmPassword" type="password" placeholder="Повторите пароль" />
      <span class="field-error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
      </div>
    </div>

    <label class="agreement">
      <input type="checkbox" v-model="agreement" />
      Я согласен на обработку персональных данных
    </label>

    <button :disabled="!agreement" @click="handleRegister">Зарегистрироваться</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>


<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 300px; /* столько же, сколько ширина input */
}

.field-error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  width: 100%;
}

.form {
  flex-direction: column;
  display: flex;
  background-color: rgba(228, 239, 255, 1);
  padding: 20px;
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 180, 216, 0.2);
}

h2 {
  color: rgba(0, 97, 148, 1);
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group label {
  width: 150px;
  color: rgba(0, 97, 148, 1);
  font-weight: bold;
}

.form-group input {
  width: 300px;
  padding: 10px;
  border: 2px solid rgba(136, 194, 254, 1);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: rgb(89, 155, 225);
}

.agreement {
  margin-left: 100px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #097287;
}

button {
  margin-left: 150px;
  width: 200px;
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
}

button:disabled {
  background-color: rgb(189, 189, 189);
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}


/* === чтобы перекрыть цвет инпута автозаплнение === */
::v-deep(input:-webkit-autofill),
::v-deep(input:-webkit-autofill:hover),
::v-deep(input:-webkit-autofill:focus),
::v-deep(input:-webkit-autofill:active) {
  /* Заполняем фон тем же цветом, что у обычного input */
  -webkit-box-shadow: 0 0 0 1000px rgb(255, 255, 255) !important; 
  box-shadow:        0 0 0 1000px rgb(224, 255, 216) inset !important;

  /* Цвет вводимого текста внутри автозаполненного поля */
  -webkit-text-fill-color: #000 !important;  /* или #097287, если нужен синий */

  /* Небольшой «хак», чтобы фон не мигал */
  transition: background-color 9999s ease-in-out 0s;
}

/* === Адаптивность для мобильных === */
@media (max-width: 600px) {
  .form {
    max-width: 90%;
    padding: 15px;
  }

  .form-group {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 12px;
  }

  .form-group label {
    width: 100%;
    margin-bottom: 6px;
    font-size: 14px;
  }

  .input-wrapper {
    width: 100%;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
  }

  .agreement {
    margin-left: 0;
    font-size: 13px;
    gap: 8px;
    margin-bottom: 12px;
  }

  button {
    margin-left: 0;
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }
}

</style>
