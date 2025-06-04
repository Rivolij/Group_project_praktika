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
      <div class="soob">
      <p>Внимание! Чтобы подать заявку, необходимо зарегистрироваться/авторизоваться.</p>
      </div>
      <div class="win">
      <h2>Личный кабинет</h2>
      <p class="subtitle">Авторизуйтесь, чтобы получить доступ к личному кабинету!</p>

      <div class="form-toggle-buttons">
        <button :class="{ active: currentForm === 'login' }" @click="setForm('login')">
          Вход
        </button>
        <button :class="{ active: currentForm === 'register' }" @click="setForm('register')">
          Регистрация
        </button>
      </div>
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
.win {
  margin-top: -80px;
}
.soob {
  color: white;
  background-color: rgb(255, 95, 95);
  font-size: 18px;
  padding-left: 15px;
  width: 200px;
  border: rgb(255, 79, 79) 2px solid;
  border-radius: 15px;
  margin-top: -20px;
  margin-right: 400px;
  margin-left: -250px;
}

.soob:hover {
  transform: scale(1.3);
  transition: transform 0.8s;
}
.account-container {
  width: 700px;
  padding: 20px;
  background-color: rgba(228, 239, 255, 1);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 180, 216, 0.2);
  margin-bottom: 70px;
}

h2 {
  text-align: center;
  color: rgba(0, 97, 148, 1);
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  margin-bottom: 20px;
  color: rgba(0, 97, 148, 1);
  font-size: 16px;
}

.form-toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.form-toggle-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 196, 142, 1);
  color: rgb(255, 255, 255);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-toggle-buttons button:hover {
  background-color: rgb(255, 156, 43);
  color: white;
}

.form-toggle-buttons button.active {
  background-color: rgb(255, 96, 43);
  color: white;
}
</style>

