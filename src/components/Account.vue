<script setup>
import { ref, onMounted } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import UserProfile from './UserProfile.vue'

const emit = defineEmits(['login-success', 'logout', 'submit-application', 'open-admin-panel', 'open-my-requests'])

const isLoggedIn = ref(false)
const currentForm = ref('login')
const currentUser = ref(null)

onMounted(() => {
  // Добавим админа, если его нет
  const adminUser = {
    login: 'admin',
    password: 'adminWSR',
    role: 'admin',
    name: 'Администратор'
  }

  let users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

  const adminExists = users.some(u => u.login === adminUser.login)
  if (!adminExists) {
    users.push(adminUser)
    localStorage.setItem('registeredUsers', JSON.stringify(users))
  }

  // Проверка текущего пользователя
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
    isLoggedIn.value = true
  }
})

function setForm(form) {
  currentForm.value = form
}

function registerUser(newUser) {
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  const exists = users.some(u => u.login === newUser.login)
  if (exists) {
    return
  }
  users.push(newUser)
  localStorage.setItem('registeredUsers', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))
  currentUser.value = newUser
  isLoggedIn.value = true
  emit('login-success', newUser)
}

function loginUser(credentials) {
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  const user = users.find(u => u.login === credentials.login && u.password === credentials.password)
  if (!user) {
    return
  }
  localStorage.setItem('currentUser', JSON.stringify(user))
  currentUser.value = user
  isLoggedIn.value = true
  emit('login-success', user)
}

function handleLogout() {
  isLoggedIn.value = false
  currentUser.value = null
  currentForm.value = 'login'
  localStorage.removeItem('currentUser')
  emit('logout')
}
</script>

<template>
  <div class="account-container">
    <template v-if="!isLoggedIn">
      <h2>Личный кабинет</h2>
      <p>Авторизуйтесь, чтобы получить доступ к личному кабинету!</p>

      <div class="form-toggle-buttons">
        <button :class="{ active: currentForm === 'login' }" @click="setForm('login')">
          Вход
        </button>
        <button :class="{ active: currentForm === 'register' }" @click="setForm('register')">
          Регистрация
        </button>
      </div>

      <LoginForm
        v-if="currentForm === 'login'"
        @login="loginUser"
      />
      <RegisterForm
        v-if="currentForm === 'register'"
        @register-success="registerUser"
      />
    </template>

    <UserProfile
      v-else
      :user="currentUser"
      @logout="handleLogout"
      @submit-application="$emit('submit-application')"   
      @open-admin-panel="$emit('open-admin-panel')"    
      @open-my-requests="$emit('open-my-requests')" 
    />
  </div>
</template>


<style scoped>
.form-toggle-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}

.form-toggle-buttons button {
  padding: 6px 12px;
  border: none;
  background: #ccc;
  cursor: pointer;
}

.form-toggle-buttons button.active {
  background: #888;
  color: white;
}
</style>
