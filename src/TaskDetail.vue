<template>
  <Nav />
  <BoardTask />
  <TaskPanel />
</template>

<script>
import BoardTask from './components/BoardTask.vue'
import TaskPanel from './components/TaskPanel.vue'
import Nav from './components/Nav.vue'
import axios from 'axios'
import { inject, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'


export default {
  components: {
    BoardTask,
    Nav,
    TaskPanel
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
