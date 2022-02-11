<template>
  <Nav />
  <div class="flex flex-row px-4">
    <div class="w-1/2 flex flex-col">
      <h2 class="text-2xl font-bold my-4">Nuevo Comentario</h2>
      <textarea type="text" name="description" rows="5" placeholder="Escribe un comentario..." class="w-full border border-gray-200 px-2 py-2" v-model="description"></textarea>
      <button class="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-500 mt-4" @click="saveTaskComment">Guardar</button>
    </div>
    <div class="w-1/2 pl-4 h-screen overflow-y-auto ">
      <h2 class="text-2xl font-bold my-4">Historial</h2>
      <ul class="flex flex-col">
        <li class="flex bg-gray-100 p-2 mb-4 text-sm space-x-1" v-for="comment in comments" :key="comment.id">
          <p class="flex flex-col w-1/4">
            <span class="text-xs">{{comment.client_name}}</span>
            <span class="font-bold text-xs">{{comment.created_at}}</span>
          </p>
          <p class="w-3/4">{{comment.description}}</p>
          
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
  textarea {
    resize: none
  }
</style>
<script>
import axios from 'axios'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import { inject, ref } from 'vue'
import Nav from './components/Nav.vue'
export default {
  components: {
    Nav
  },
  setup(){
    if (!localStorage.getItem('employee')) {
        router.push('/login');
    }
    const router = useRouter()
    const route = useRoute()
    const taskId = route.params.task_id
    const store = inject('store')
    const task = ref({})
    const comments = ref([])
    const description = ref('')
    task.value = store.state.tasks.find((item) => item.id == taskId )
    if(!task.value){
      router.push({name: 'Calendar'})
    }

    const saveTaskComment = async() => {
      const API_URL = import.meta.env.VITE_API
      const taskComment = {
        id: new Date().getTime(),
        task_id: task.value.id,
        employee_id: task.value.employee_id,
        client_id: task.value.client_id,
        client_name: task.value.client,
        employee_name: task.value.employee,
        description: description.value,
        created_at: getToday()
      }
      
      let taskComments = JSON.parse(localStorage.getItem('task_comments'))
      taskComments = taskComments || []
      taskComments.push(taskComment)
      localStorage.setItem('task_comments', JSON.stringify(taskComments))
      comments.value.unshift(taskComment)
      let response = await axios.post(`${API_URL}/tasks/comment/save`, taskComment);
    }

    const getToday = () => {
      return moment().format('YYYY-MM-DD HH:mm')
    }

    return {
      description,
      task,
      saveTaskComment,
      getToday,
      comments
    }
  },

  async mounted(){
    const API_URL = import.meta.env.VITE_API
    if(this.task){
      let taskComments = await axios.get(`${API_URL}/tasks/comments/${this.task.id}`);
      taskComments = taskComments.data || []
      
      this.comments = taskComments.filter((item) => item.task_id == this.task.id)  
    }

  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
