<script setup>
import { ref, computed, onMounted } from 'vue'

const requests = ref([])
const currentUserId = ref('')
const currentUserName = ref('')

const showModal = ref(false)
const requestToDelete = ref(null)
const expandedRequestIds = ref([])

// Новый ref для выбранного фильтра
const selectedStatus = ref('Все статусы')

const statuses = ['Все статусы', 'Новая', 'В работе', 'Выполнено', 'Отклонена']

onMounted(() => {
  const storedId = localStorage.getItem('currentUserId')
  const storedName = localStorage.getItem('currentUserName')

  currentUserId.value = storedId || 'user_' + Math.random().toString(36).substring(2, 10)
  if (!storedId) localStorage.setItem('currentUserId', currentUserId.value)

  currentUserName.value = storedName || 'Пользователь'
  if (!storedName) localStorage.setItem('currentUserName', currentUserName.value)

  const saved = localStorage.getItem('requests')
  if (saved) {
    requests.value = JSON.parse(saved)
  }
})

// Группировка заявок с учётом выбранного фильтра
const groupedRequests = computed(() => {
  const groups = {
    Новая: [],
    'В работе': [],
    Выполнено: [],
    Отклонена: []
  }

  for (const r of requests.value) {
    if (r.userId === currentUserId.value) {
      if (selectedStatus.value === 'Все статусы' || r.status === selectedStatus.value) {
        groups[r.status]?.push(r)
      }
    }
  }

  // Если выбран конкретный статус, вернуть только этот столбик
  if (selectedStatus.value !== 'Все статусы') {
    return {
      [selectedStatus.value]: groups[selectedStatus.value]
    }
  }

  // Иначе вернуть все
  return groups
})

function confirmDeleteRequest(id) {
  requestToDelete.value = id
  showModal.value = true
}

function deleteRequestConfirmed() {
  requests.value = requests.value.filter(r => r.id !== requestToDelete.value)
  localStorage.setItem('requests', JSON.stringify(requests.value))
  showModal.value = false
  requestToDelete.value = null
}

function cancelDelete() {
  showModal.value = false
  requestToDelete.value = null
}

function toggleExpand(id) {
  if (expandedRequestIds.value.includes(id)) {
    expandedRequestIds.value = expandedRequestIds.value.filter(rid => rid !== id)
  } else {
    expandedRequestIds.value.push(id)
  }
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s/g, '-')
}
</script>

<template>
  <div class="container">
    <h1>Мои заявки</h1>

    <!-- Фильтр по статусу -->
    <div class="filter">
      <label for="statusFilter">Фильтр по статусу:</label>
      <select id="statusFilter" v-model="selectedStatus">
        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>

    <div v-if="Object.values(groupedRequests).every(group => group.length === 0)" class="no-requests">
      У вас пока нет заявок.
    </div>

    <div class="status-columns" v-else>
      <div class="status-column" v-for="(requests, status) in groupedRequests" :key="status">
        <h2 :class="['status-header', statusClass(status)]">{{ status }}</h2>

        <template v-if="requests.length > 0">
          <div v-for="req in requests" :key="req.id" class="request-card" @click="toggleExpand(req.id)">
            <div class="request-header">
              <h3>{{ req.title }}</h3>
              <span class="timestamp">{{ new Date(req.timestamp).toLocaleString() }}</span>
            </div>

            <div v-if="expandedRequestIds.includes(req.id)" class="request-details" @click.stop>
              <p><strong>Категория:</strong> {{ req.category }}</p>
              <p><strong>Описание:</strong> {{ req.description }}</p>
              <img v-if="req.imageUrl" :src="req.imageUrl" alt="Фото" class="image-preview" />

              <div v-if="req.status === 'Отклонена' && req.comment" class="rejection-comment">
                ПРИЧИНА ОТКЛОНЕНИЯ: {{ req.comment }}
              </div>

              <button v-if="req.status === 'Новая'" @click.stop="confirmDeleteRequest(req.id)" class="delete-button">
                Удалить заявку
              </button>
            </div>
          </div>
        </template>

        <p v-else class="no-requests">Нет заявок</p>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <p>Вы уверены, что хотите удалить заявку?</p>
      <div class="modal-actions">
        <button @click="deleteRequestConfirmed" class="confirm-button">Да, удалить</button>
        <button @click="cancelDelete" class="cancel-button">Отмена</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.user-info {
  color: #555;
  margin-bottom: 1rem;
}

.filter {
  margin-bottom: 1rem;
}

.filter label {
  margin-right: 10px;
  font-weight: 600;
}

.filter select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.no-requests {
  color: #888;
  margin-top: 1.5rem;
  text-align: center;
}

.status-columns {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.status-column {
  flex: 1;
  min-width: 250px;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
}

.status-header {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 4px;
}

.status-header.новая {
  color: #028ad2;
}

.status-header.в-работе {
  color: #9b51e0;
}

.status-header.выполнено {
  color: #2f855a;
}

.status-header.отклонена {
  color: #e53e3e;
}

.request-card {
  background-color: #e4efff;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.request-card:hover {
  background-color: #d1e8ff;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 0.8rem;
  color: #555;
}

.request-details {
  margin-top: 0.8rem;
  font-size: 0.95rem;
}

.image-preview {
  margin-top: 10px;
  max-width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.rejection-comment {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
  padding: 12px;
  margin-top: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.delete-button {
  margin-top: 1rem;
  background-color: #e53e3e;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #c53030;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.confirm-button {
  background-color: #e53e3e;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #c53030;
}

.cancel-button {
  background-color: #e2e8f0;
  color: black;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #cbd5e0;
}
</style>
