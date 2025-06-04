<script setup>
const emit = defineEmits(['logout', 'submit-application', 'open-my-requests', 'open-admin-panel'])

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

function handleLogout() {
  emit('logout')
}

function handleSubmitApplication() {
  emit('submit-application')
}

function handleOpenMyRequests() {
  emit('open-my-requests')
}

function handleOpenAdminPanel() {
  emit('open-admin-panel')
}
</script>

<template>
  <div class="profile">
    <h2>Добро пожаловать, {{ props.user.firstName }}!</h2>
    <p><strong>Роль:</strong> {{ props.user.role === 'admin' ? 'Администратор' : 'Пользователь' }}</p>
    <p><strong>Email:</strong> {{ props.user.email }}</p>
    <p><strong>ФИО:</strong> {{ props.user.lastName }} {{ props.user.firstName }} {{ props.user.middleName }}</p>
    <p>Теперь вы можете подать заявку на улудшение города, а так же просмотреть статус уже поданных вами заявок:</p>

    <div v-if="props.user.role === 'admin'" class="admin-section">
      <h3>Админ-панель</h3>
      <p>Здесь доступен дополнительный контент для администратора.</p>
      <button @click="handleOpenAdminPanel">Панель управления</button>
    </div>

    <div v-else class="user-section">
      <button @click="handleSubmitApplication">Подать заявку</button>
      <button @click="handleOpenMyRequests">Мои заявки</button>
    </div>

    <button class="logout-button" @click="handleLogout">Выйти</button>
  </div>
</template>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile h2 {
  margin-bottom: 16px;
  font-size: 24px;
  color: #333;
}

.profile p {
  margin: 8px 0;
  font-size: 16px;
}

button {
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  margin: 8px 8px 0 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.logout-button {
  background-color: #e74c3c;
}

.logout-button:hover {
  background-color: #c0392b;
}
</style>
