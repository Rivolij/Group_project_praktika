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
    <p>Роль: {{ props.user.role === 'admin' ? 'Администратор' : 'Пользователь' }}</p>
    <p>Email: {{ props.user.email }}</p>
    <p>ФИО: {{ props.user.lastName }} {{ props.user.firstName }} {{ props.user.middleName }}</p>

    <div v-if="props.user.role === 'admin'">
      <h3>Админ-панель</h3>
      <p>Здесь доступен дополнительный контент для администратора.</p>
      <button @click="handleOpenAdminPanel">Панель управления</button>
    </div>

    <div v-else>
      <button @click="handleSubmitApplication">Подать заявку</button>
      <button @click="handleOpenMyRequests">Мои заявки</button>
    </div>

    <button @click="handleLogout">Выйти</button>
  </div>
</template>

<style scoped>
.profile p {
  margin: 4px 0;
}
button {
  margin-top: 10px;
  margin-right: 10px;
}
</style>

