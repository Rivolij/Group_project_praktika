<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const login = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  // Просто отправляем данные наверх — пусть родитель проверяет
  emit('login', {
    login: login.value,
    password: password.value
  })
}
</script>

<template>
  <div class="form">
    <input v-model="login" placeholder="Логин" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button @click="handleLogin">Войти</button>
  </div>
</template>

<style scoped>
.form input {
  display: block;
  margin-bottom: 10px;
}
</style>
