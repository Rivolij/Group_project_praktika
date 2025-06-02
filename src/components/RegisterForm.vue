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

function handleRegister() {
  error.value = ''  // очищаем ошибку перед проверками
  const users = JSON.parse(localStorage.getItem('users') || '[]')

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
    <input v-model="user.login" placeholder="Логин" />
    <input v-model="user.lastName" placeholder="Фамилия" />
    <input v-model="user.firstName" placeholder="Имя" />
    <input v-model="user.middleName" placeholder="Отчество" />
    <input v-model="user.email" placeholder="Email" />
    <input v-model="user.password" type="password" placeholder="Пароль" />
    <input v-model="user.confirmPassword" type="password" placeholder="Повторите пароль" />
    <button @click="handleRegister">Зарегистрироваться</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.auth-form input {
  display: block;
  margin-bottom: 10px;
}
.error {
  color: red;
}
</style>
