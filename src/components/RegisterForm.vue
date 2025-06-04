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

const error = ref('')
const agreement = ref(false)

function handleRegister() {
  error.value = ''

  const users = JSON.parse(localStorage.getItem('users') || '[]')

  if (!agreement.value) {
    error.value = 'Вы должны согласиться на обработку персональных данных'
    emit('register-error', error.value)
    return
  }

  if (users.find(u => u.login === user.value.login)) {
    error.value = 'Пользователь с таким логином уже существует'
    emit('register-error', error.value)
    return
  }

  if (user.value.password !== user.value.confirmPassword) {
    error.value = 'Пароли не совпадают'
    emit('register-error', error.value)
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
      <input id="login" v-model="user.login" placeholder="Введите логин" />
    </div>

    <div class="form-group">
      <label for="lastName">Фамилия</label>
      <input id="lastName" v-model="user.lastName" placeholder="Иванова" />
    </div>

    <div class="form-group">
      <label for="firstName">Имя</label>
      <input id="firstName" v-model="user.firstName" placeholder="Иван" />
    </div>

    <div class="form-group">
      <label for="middleName">Отчество</label>
      <input id="middleName" v-model="user.middleName" placeholder="Иванович" />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="user.email" placeholder="ivanov@email.ru" />
    </div>

    <div class="form-group">
      <label for="password">Пароль</label>
      <input id="password" v-model="user.password" type="password" placeholder="Введите пароль" />
    </div>

    <div class="form-group">
      <label for="confirmPassword">Повторите пароль</label>
      <input id="confirmPassword" v-model="user.confirmPassword" type="password" placeholder="Повторите пароль" />
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

</style>
