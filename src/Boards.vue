<template>
  <Nav />
  <Board />
  <div class="bg-white">
    <div class="relative max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">Tableros</h2>
        <button class="absolute hidden md:block top-2 right-2 text-white text-sm rounded-md bg-pink-600 px-4 py-2" @click="showBoard">Nuevo Tablero</button>
      <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <div v-for="board in store.state.boards" :key="board.id" class="group relative cursor-pointer" @click="showBoardTasks(board)">
          <div class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            <img src="https://www.kindpng.com/picc/m/78-780025_week-2-icon-mood-board-icon-hd-png.png" alt="" class="w-full h-full object-center object-cover lg:w-full lg:h-full" />
          </div>
          <div class="mt-4 flex flex-col">
            <div>
              <h3 class="text-md lg:text-xl font-extrabold text-center w-full text-gray-700">
                  <span aria-hidden="true" class="absolute inset-0" />
                  {{ board.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="absolute block md:hidden bottom-2 right-2 text-white text-sm rounded-full bg-pink-600 p-4" @click="showBoard">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    </button>
  </div>

</template>

<script>
import Board from './components/Board.vue'
import Nav from './components/Nav.vue'
import axios from 'axios'
import { inject, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    Nav,
    Board
  },

  setup() {
    let router = useRouter()
    const store = inject('store')
    const boards = ref([])
    const showBoardTasks = (item) => {

      router.push(`/boards/tasks/${item.id}`)
    }
    const showBoard = () => {
      store.state.show = true
      store.state.edit = false
      store.state.task = {}
      store.state.board = {}
    }

    return {
      store,
      boards,
      showBoard,
      showBoardTasks
    }
  },
  async created(){
    const API_URL = import.meta.env.VITE_API
    const employee = JSON.parse(localStorage.getItem('employee'));
    if(employee){
      let response = await axios.get(`${API_URL}/boards/employees/${employee.id}`);
      this.store.state.boards = response.data
      localStorage.setItem('boards', JSON.stringify(response.data));
    }
    return [];
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
