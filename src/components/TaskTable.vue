<template>
  <div class="flex flex-row my-8">
    <div class="w-2/3 md:px-4">
      <input type="text" class="w-full border border-gray-400 p-2 rounded-sm" v-model="taskSearch" placeholder="Buscar por cliente o descripcion">
    </div>
    <div class="w-1/3 md:pr-4">
      <button type="button" class="bg-gray-800 text-white w-full md:w-32 text-xm px-4 py-2 float-left rounded-md" @click="filterTask">
      <span class="hidden md:block">Filtrar Tareas</span>
      <span class="sm:block md:hidden">Filtrar</span>
    </button>
      <button type="button" class="hidden md:block bg-pink-600 text-white text-xm px-4 py-2 float-right rounded-md" @click="showTask">Nueva Tarea</button>
      <button type="button" class="md:hidden bg-pink-600 rounded-full text-white px-4 py-4 fixed bottom-4 right-4" @click="showTask"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg></button>
    </div>
  </div>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripcion
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de inicio
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de fin
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in tasksList" :key="task.id">
                <td class="px-2 py-2 ">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 text-xs">
                      {{task.client_name}}
                    </div>
                  </div>
                </td>
                <td class="px-2 py-2 ">
                  <div class="text-xs text-gray-900">{{ task.employee_name }}</div>
                </td>
                <td class="px-2 py-2 ">
                  <div class="text-xs text-gray-900">{{ task.description }}</div>
                </td>
                <td class="px-2 py-2  text-xs text-gray-500">
                  <div class="text-xs text-gray-900">{{ task.start }}</div>
                </td>
                <td class="px-2 py-2  text-xs text-gray-500">
                  <div class="text-xs text-gray-900">{{ task.end }}</div>
                </td>
                <td class="px-2 py-2  text-right text-xs font-medium">
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"  @click="editTask(task.id)">Editar</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
import Task from '../components/Task.vue'

export default {
  components: {
    Task,
  },
  props: {
    tasks: Object
  },
  setup() {
    const store = inject('store')
    let taskSearch = ref('');
    let tasksList = ref([]);
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if(tasks){
       store.state.tasks = tasks
    }
    tasksList.value = store.state.tasks;

    const filterTask = () => {
      tasksList.value = store.state.tasks.filter(task => (task.client_name.toLowerCase().indexOf(taskSearch.value.toLowerCase()) >= 0 ||  task.employee_name.indexOf(taskSearch.value.toLowerCase()) >= 0) || task.description.toLowerCase().indexOf(taskSearch.value.toLowerCase()) >= 0);
      
    }
    const editTask = (task_id) => {
      store.state.task = getTask(task_id)
      store.state.start = getFormattedDate(store.state.task.start)
      store.state.show = true
      store.state.edit = true
      console.log(store.state.start)
    }

    const getFormattedDate = (date) => {
      date = new Date(date)
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    const getTask = (task_id) => {
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      for(let item of tasks){
        if(parseInt(item.id) == parseInt(task_id)){
          return item;
        }
      }
      return null;
    }

    const showTask = () => {
      console.log('showTask')
      store.state.show = true
      store.state.edit = false
      store.state.task = {}
    }
    return {
      store,
      editTask,
      taskSearch,
      filterTask,
      showTask,
      tasksList,
      getFormattedDate,
      getTask
    }
  },
}
</script>
