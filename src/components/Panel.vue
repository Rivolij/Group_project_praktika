<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const requests = ref([])
const selectedStatus = ref('')
const comment = ref('')
const selectedRequest = ref(null)
const showRejectModal = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('requests')
  if (saved) {
    requests.value = JSON.parse(saved)
  }
})

watch(requests, (newVal) => {
  localStorage.setItem('requests', JSON.stringify(newVal))
}, { deep: true })

function updateStatus(request, status) {
  selectedRequest.value = request
  selectedStatus.value = status
  comment.value = ''
  if (status === 'Отклонена') {
    showRejectModal.value = true
  } else {
    applyStatusChange(status)
  }
}

function applyStatusChange(status, reason = '') {
  const req = requests.value.find(r => r.id === selectedRequest.value.id)
  if (req && req.status !== 'Решено' && req.status !== 'Отклонена') {
    req.status = status
    if (status === 'Отклонена') {
      req.comment = reason
    }
  }
  selectedRequest.value = null
  selectedStatus.value = ''
}

function confirmRejection() {
  if (!comment.value.trim()) return alert('Укажите причину отклонения')
  applyStatusChange('Отклонена', comment.value)
  showRejectModal.value = false
}

const newRequests = computed(() => requests.value.filter(r => r.status === 'Новая'))
const inProgressRequests = computed(() => requests.value.filter(r => r.status === 'Решается'))
const resolvedRequests = computed(() =>
  requests.value.filter(r => r.status === 'Решено' || r.status === 'Отклонена')
)
</script>

<template>
  <div class="container">
    <h1>Панель администратора</h1>

    <!-- Новые заявки -->
    <h2>Новые заявки</h2>
    <div v-if="newRequests.length" class="request-list">
      <div class="request" v-for="req in newRequests" :key="req.id">
        <img :src="req.imageUrl" alt="Фото" />
        <h2>{{ req.title }}</h2>
        <p>{{ req.description }}</p>
        <p><strong>Категория:</strong> {{ req.category }}</p>
        <p><strong>Пользователь:</strong> {{ req.userId }}</p>
        <p>
          <strong>Статус:</strong>
          <span :class="'status ' + req.status.toLowerCase()">{{ req.status }}</span>
        </p>
        <p class="timestamp">Добавлено: {{ req.timestamp }}</p>

        <div class="admin-actions">
          <button @click="updateStatus(req, 'Решается')">Решается</button>
          <button @click="updateStatus(req, 'Решено')">Решено</button>
          <button @click="updateStatus(req, 'Отклонена')">Отклонить</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Нет новых заявок.</p>
    </div>

    <!-- Решаются -->
    <h2>Решаются</h2>
    <div v-if="inProgressRequests.length" class="request-list">
      <div class="request" v-for="req in inProgressRequests" :key="req.id">
        <div class="solved-label">РЕШАЕТСЯ</div>
        <img :src="req.imageUrl" alt="Фото" />
        <h2>{{ req.title }}</h2>
        <p>{{ req.description }}</p>
        <p><strong>Категория:</strong> {{ req.category }}</p>
        <p><strong>Пользователь:</strong> {{ req.userId }}</p>
        <p>
          <strong>Статус:</strong>
          <span :class="'status ' + req.status.toLowerCase()">{{ req.status }}</span>
        </p>
        <p class="timestamp">Добавлено: {{ req.timestamp }}</p>

        <div class="admin-actions">
          <button @click="updateStatus(req, 'Решено')">Решено</button>
          <button @click="updateStatus(req, 'Отклонена')">Отклонить</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Нет заявок со статусом «Решается».</p>
    </div>

    <!-- Решённые и отклонённые -->
    <h2>Решённые заявки</h2>
    <div class="request-list">
      <div class="request" v-for="req in resolvedRequests" :key="req.id">
        <div class="solved-label">{{ req.status.toUpperCase() }}</div>
        <img :src="req.imageUrl" alt="Фото" />
        <h2>{{ req.title }}</h2>
        <p>{{ req.description }}</p>
        <p><strong>Категория:</strong> {{ req.category }}</p>
        <p><strong>Пользователь:</strong> {{ req.userId }}</p>
        <p>
          <strong>Статус:</strong>
          <span :class="'status ' + req.status.toLowerCase()">{{ req.status }}</span>
        </p>
        <p class="timestamp">Добавлено: {{ req.timestamp }}</p>
        <p v-if="req.comment"><strong>Комментарий:</strong> {{ req.comment }}</p>
      </div>
    </div>

    <!-- Модалка для отклонения -->
    <div v-if="showRejectModal" class="modal-backdrop">
      <div class="modal">
        <p>Укажите причину отклонения:</p>
        <textarea v-model="comment" placeholder="Комментарий..." />
        <div class="modal-buttons">
          <button class="yes-btn" @click="confirmRejection">Подтвердить</button>
          <button class="no-btn" @click="showRejectModal = false">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  background: #e4efff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}
h1, h2 {
  text-align: center;
  color: #006194;
  margin-bottom: 1rem;
}
.request-list {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.request {
  background: white;
  padding: 1rem;
  border: 2px solid #88C2FE;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 97, 148, 0.1);
  position: relative;
}
.solved-label {
  position: absolute;
  top: -14px;
  left: -14px;
  background: #028AD2;
  color: white;
  padding: 6px 12px;
  font-weight: bold;
  font-size: 0.85rem;
  border-radius: 8px;
}
.request img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}
.status {
  font-weight: bold;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-block;
  color: white;
}
.status.новая {
  background: #88C2FE;
}
.status.решается {
  background: #FFA500;
}
.status.решено {
  background: #028AD2;
}
.status.отклонена {
  background: #FFC48E;
  color: #000;
}
.timestamp {
  font-size: 0.85rem;
  color: #555;
}
.admin-actions {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}
.admin-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #006194;
  color: white;
  font-weight: 600;
}
.admin-actions button:hover {
  background: #028AD2;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
}
.modal textarea {
  width: 100%;
  min-height: 80px;
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 1rem;
}
.modal-buttons {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.yes-btn, .no-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.yes-btn {
  background: #028AD2;
  color: white;
}
.no-btn {
  background: #FFC48E;
  color: black;
}
</style>
