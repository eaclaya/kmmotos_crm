<template>
  <Nav />
  <BoardTask />
  <div class="bg-white shadow overflow-hidden sm:rounded-md relative">
    <div class="px-4 py-5 sm:px-6">
      <button v-if="owner" class="text-sm border-red-600 border-2 hover:bg-red-600 hover:text-white rounded-md px-4 py-2 text-red-600 absolute top-2 left-2" @click="deleteBoard">Eliminar Tablero</button>
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Tareas
      </h3>
      <button class="text-sm bg-pink-600 px-4 py-2 text-white rounded-md absolute top-2 right-2" @click="showTask">Nueva Tarea</button>
    </div>
    <div class="border-t border-gray-200">
        <div class="bg-gray-50 px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-200" v-for="task in board.tasks" :key="task.id" @click="showTaskPanel(task)">
          <div class="text-sm font-medium text-gray-500 w-full pb-4">
            <span class="text-pink-600 mr-8 float-left text-xs">{{task.created_at}}</span>
            <span class="float-left">{{task.description}}</span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import BoardTask from './components/BoardTask.vue'
import Nav from './components/Nav.vue'
import axios from 'axios'
import { inject, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'


export default {
  components: {
    BoardTask,
    Nav
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const boardId = route.params.board_id
    const store = inject('store')
    const board = ref({})
    const owner = ref(false)
    console.log(store.state.boards)
    if(store.state.boards.length == 0){
      store.state.boards = JSON.parse(localStorage.getItem('boards'))
    }
    board.value = store.state.boards.find((item) => item.id == boardId )
    if(!board.value){
      return router.push('/boards')
    }
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (!employee) {
        return router.push('/login');
    }
    if(employee.id == board.value.employee_id){
      owner.value = true
    }
    if(!board.value){
      return router.push('/boards')
    }

    const showTask = (item) => {
      console.log('showTask => ', board.value)
      store.state.show = true
      store.state.edit = false
      store.state.board = board.value
      store.state.task = {}
    }
    const deleteBoard = async() => {
      const API_URL = import.meta.env.VITE_API
      if(!board.value){
        return;
      }
      const data = {
        board_id: board.value.id
      }
      let response = await axios.post(`${API_URL}/boards/delete`, data)
      store.state.boards = store.state.boards.filter((item) => item.id != board.value.id)
      router.push('/boards')
    }

    const showTaskPanel = (task) => {
      store.state.open = true
      store.state.task = task 
    }

    return {
      board,
      owner,
      showTask,
      showTaskPanel,
      deleteBoard
    }
  },
   
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
