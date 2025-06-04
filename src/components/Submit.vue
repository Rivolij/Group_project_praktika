<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const title = ref('')
const description = ref('')
const category = ref('')
const otherCategory = ref('')
const image = ref(null)
const statusFilter = ref('Все')
const categories = ['Дороги', 'Освещение', 'Мусор', 'Вандализм', 'Другое']
const requests = ref([])
const errors = ref([])
const successMessage = ref('')
const agree = ref(false)

const currentUserId = ref('')

// Модальное окно удаления
const showDeleteModal = ref(false)
const requestToDelete = ref(null)

onMounted(() => {
  const storedUserId = localStorage.getItem('currentUserId')
  if (storedUserId) {
    currentUserId.value = storedUserId
  } else {
    currentUserId.value = 'user_' + Math.random().toString(36).substring(2, 10)
    localStorage.setItem('currentUserId', currentUserId.value)
  }

  const saved = localStorage.getItem('requests')
  if (saved) {
    requests.value = JSON.parse(saved)
  }
})

watch(requests, (newVal) => {
  localStorage.setItem('requests', JSON.stringify(newVal))
}, { deep: true })

function validateForm() {
  errors.value = []
  if (!title.value) errors.value.push('Название обязательно')
  if (!description.value) errors.value.push('Описание обязательно')
  if (!category.value) errors.value.push('Категория обязательна')
  if (category.value === 'Другое' && !otherCategory.value.trim()) {
    errors.value.push('Уточните категорию в поле "Другое"')
  }
  if (!agree.value) {
  errors.value.push('Необходимо согласие на обработку данных')
}
  if (!image.value) {
    errors.value.push('Фото обязательно')
  } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'].includes(image.value.type)) {
    errors.value.push('Недопустимый формат изображения')
  } else if (image.value.size > 10 * 1024 * 1024) {
    errors.value.push('Максимальный размер фото — 10Мб')
  }
  return errors.value.length === 0
}

function submitForm() {
  if (!validateForm()) return

  const reader = new FileReader()
  reader.onload = () => {
    const newRequest = {
      id: Date.now(),
      title: title.value,
      description: description.value,
      category: category.value === 'Другое' ? `Другое: ${otherCategory.value}` : category.value,
      status: 'Новая',
      timestamp: new Date().toLocaleString(),
      imageUrl: reader.result,
      userId: currentUserId.value
    }

    requests.value.push(newRequest)

    title.value = ''
    description.value = ''
    category.value = ''
    otherCategory.value = ''
    image.value = null
    successMessage.value = 'Заявка успешно отправлена!'
    setTimeout(() => successMessage.value = '', 4000)
  }

  reader.readAsDataURL(image.value)
}

function handleImageUpload(event) {
  image.value = event.target.files[0]
}

function askDeleteConfirmation(req) {
  if (req.status !== 'Новая') return alert('Удалять можно только заявки со статусом "Новая"')
  if (req.userId !== currentUserId.value) return alert('Вы можете удалять только свои заявки')
  requestToDelete.value = req
  showDeleteModal.value = true
}

function confirmDelete() {
  requests.value = requests.value.filter(r => r.id !== requestToDelete.value.id)
  closeModal()
}

function closeModal() {
  showDeleteModal.value = false
  requestToDelete.value = null
}

const filteredRequests = computed(() => {
  return requests.value.filter(r =>
    r.userId === currentUserId.value &&
    (statusFilter.value === 'Все' || r.status === statusFilter.value)
  )
})
</script>


<template>
  <div class="container">
    <h1>Создание заявки</h1>

    <div class="form">
      <label>Название</label>
      <input type="text" v-model="title" placeholder="Например: Яма на дороге" />
      <p class="error" v-if="errors.includes('Название обязательно')">Название обязательно</p>

      <label>Описание</label>
      <textarea v-model="description" placeholder="Опишите проблему..."></textarea>
      <p class="error" v-if="errors.includes('Описание обязательно')">Описание обязательно</p>

      <label>Категория</label>
      <select v-model="category">
        <option disabled value="">Выберите категорию</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <p class="error" v-if="errors.includes('Категория обязательна')">Категория обязательна</p>

      <div v-if="category === 'Другое'">
        <label>Уточните категорию</label>
        <input type="text" v-model="otherCategory" placeholder="Например: Нарушение правил парковки" />
        <p class="error" v-if="errors.includes('Уточните категорию в поле &quot;Другое&quot;')">Уточните категорию</p>
      </div>

      <label>Фото (jpg, png, bmp, до 10Мб)</label>
      <input type="file" accept="image/*" @change="handleImageUpload" />
      <p class="error" v-if="errors.includes('Фото обязательно')">Фото обязательно</p>
      <p class="error" v-if="errors.includes('Недопустимый формат изображения')">Недопустимый формат изображения</p>
      <p class="error" v-if="errors.includes('Максимальный размер фото — 10Мб')">Максимальный размер фото — 10Мб</p>

      <!-- Новый чекбокс -->
<div class="checkbox-wrapper">
  <label for="agree" style="display: flex; align-items: center;">
    <input type="checkbox" id="agree" v-model="agree" style="margin-right: 0; margin: 0; padding: 0;" />
    <span style="margin-left: 0;">Согласен на обработку персональных данных</span>
  </label>
</div>
<p class="error" v-if="errors.includes('Необходимо согласие на обработку данных')">Необходимо согласие на обработку данных</p>


      <button class="submit-btn" @click="submitForm">Отправить заявку</button>

      <p class="success" v-if="successMessage">{{ successMessage }}</p>
    </div>
  </div>
</template>

<style scoped>

.checkbox-wrapper label {
  display: flex;
  align-items: center;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-right: 0;
}

.checkbox-wrapper span {
  margin-left: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 400px;
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

.container {
  max-width: 800px;
  margin: auto;
  background: #e4efff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}
h1 {
  text-align: center;
  color: #006194;
  margin-bottom: 1rem;
}
.form label {
  display: block;
  margin: 10px 0 4px;
  font-weight: 600;
  color: #006194;
}
.form input,
.form textarea,
.form select {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #88C2FE;
  border-radius: 10px;
  font-size: 1rem;
}
.form textarea {
  min-height: 80px;
  resize: vertical;
}
.submit-btn {
  background: #028AD2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
}
.submit-btn:hover {
  background: #006194;
}
.success {
  color: #028AD2;
  font-weight: 600;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
  list-style: none;
  padding-left: 0;
}
.filter {
  margin: 30px 0 20px;
}
.filter label {
  font-weight: 600;
  margin-right: 10px;
  color: #006194;
}
.request-list {
  display: grid;
  gap: 1.5rem;
}
.request {
  background: white;
  padding: 1rem;
  border: 2px solid #88C2FE;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 97, 148, 0.1);
  transition: transform 0.2s;
}
.request:hover {
  transform: translateY(-4px);
}
.request img {
  display: block;
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
  margin-top: 6px;
}
.delete-btn {
  background: #FFC48E;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #ffb06e;
}
</style>

