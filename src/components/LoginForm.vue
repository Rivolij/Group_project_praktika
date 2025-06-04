<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const login = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
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
    <input id="login" v-model="login" placeholder="Введите логин" />

    <label for="password">Пароль</label>
    <input id="password" v-model="password" type="password" placeholder="Введите пароль" />

    <button type="submit">Войти</button>
    </form>
  </div>
</template>

<style scoped>
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
  align-items: center;   /* горизонтальное выравнивание */
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
  color: rgb(255, 255, 255);overflow-x: ;
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
