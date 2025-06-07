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
    <h2>Добро пожаловать, {{ user.firstName }}!</h2>
    <div class="rol"><p><strong>Роль:</strong> {{ props.user.role === 'admin' ? 'Администратор' : 'Пользователь' }}</p></div>
    <p><strong>Логин:</strong> {{ user.login }}</p>
    <p><strong>Пароль:</strong> {{ user.password }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>ФИО:</strong> {{ user.lastName }} {{ user.firstName }} {{ user.middleName }}</p>
    <p v-if="props.user.role !== 'admin'">
      Теперь вы можете подать заявку на улучшение города, а так же просмотреть статус уже поданных вами заявок:
    </p>
    <div v-if="props.user.role === 'admin'" class="admin-section">
      <h3>Админ-панель</h3>
      <p>Здесь доступен дополнительный контент для администратора. Администратор может рассмотерть заявки.</p>
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

.rol{
  color: white;
  font-weight: 900;
  border: rgb(255, 208, 137) 2px solid;
  background-color: rgb(255, 190, 98);
  border-radius: 25px;
  padding: 10px;
  width: 190px;
}
.profile {
  color: #006194;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
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
  color: #006194;
}

.profile p {
  margin: 8px 0;
  font-size: 16px;
}

button {
  padding: 10px 16px;
  background-color: #45b4fe;
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
  background-color: rgb(247, 183, 124);
}

.logout-button:hover {
  background-color: rgb(255, 156, 43);
}

@media (max-width: 480px) {
  .profile {
    max-width: 100%;
    padding: 16px;
    font-size: 14px;
  }

  .profile h2 {
    font-size: 20px;
  }

  .profile p {
    font-size: 14px;
  }

  .rol {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    text-align: center;
    margin-bottom: 12px;
  }

  /* Кнопки в блоках выстроим в столбик */
  .user-section button,
  .admin-section button,
  .logout-button {
    width: 100%;
    margin: 8px 0;
    padding: 12px 0;
    font-size: 16px;
  }
}


</style>
