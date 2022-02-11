<template>
<TransitionRoot class="task-wrapper" as="template"  :show="store.state.show">
  <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="store.state.show = false">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full md:max-w-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                    Tarea {{store.state.board.name}}
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      
                      <div class="input-wrapper">
                        <p class="mt-2">Asignar a</p>
                        <input type="text" class="px-4 py-2 w-full rounded-md border" v-model="employeeValue" @input="searchEmployee" placeholder="Escribe nombre y presiona ENTER">
                        <ul  id="employee_list" class="shadow-xl w-full">
                          <li class="p-2 hover:bg-gray-100 cursor-pointer" v-for="employee in employees"  @click="selectEmployee(employee)">{{employee.first_name}} {{employee.last_name}}</li>
                        </ul>
                      </div>  
                      <div class="input-wrapper">
                        <p class="mt-2">Fecha de inicio</p>
                        <input type="date" class="px-4 py-2 w-full rounded-md border" v-model="store.state.start">
                      </div>  
                      <div class="input-wrapper">
                        <p class="mt-2">Descripcion</p>
                        <textarea rows="5" class="px-4 py-4 rounded-md w-full border" v-model="description"></textarea> 
                      </div>  
                      <div class="input-wrapper" v-if="store.state.task.is_running">
                        <input type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-indigo-300 rounded mr-2 mt-2" v-model="store.state.task.completed" />
                        <span for="">Marcar como completado</span>
                      </div>  

                      <div class="input-wrapper">
                        <input type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-indigo-300 rounded mr-2 mt-2" v-model="is_recurring" />
                        <span for="">Marcar como recurrente</span>
                      </div>  

                      <div class="input-wrapper" v-if="is_recurring">
                        <p class="mt-2">Ejecutar cada</p>
                        <select class="border border-gray-200 w-full p-2" v-model="recurring_type">
                            <option value="Dia">Dia</option>
                            <option value="Semana">Semana</option>
                            <option value="Quincena">Quincena</option>
                            <option value="Mes">Mes</option>
                        </select>
                      </div>  

                      <div class="input-wrapper" v-if="is_recurring">
                        <p class="mt-2">Fecha de fin</p>
                        <input type="date" class="px-4 py-2 w-full rounded-md border" v-model="end">
                      </div>  
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm" @click="saveTask">
                Guardar
              </button>

              <button v-if="store.state.task.id" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="taskComments(store.state.task.id)" >
                Comentarios
              </button>

              <button v-if="store.state.task.id" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 border-red-700 text-base font-medium text-red-700 hover:bg-red-700 hover:text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"  @click="deleteTask(store.state.task.id)">
                Eliminar
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<style scoped="">
    textarea {
      resize: none;
    }
</style>
<script>
import { ref, inject, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  },
  
  setup() {
    const employees = ref([]);
    const selectedEmployee = ref([]);
    const employeeValue = ref('');
    const end = ref('');
    const is_recurring = ref(false);
    const description = ref('');
    const clients = ref([]);
    const selectedClient = ref([]);
    const clientValue = ref('');
    const store = inject('store')
    const show = ref(false);
    const recurring_type = ref('');
    const router = useRouter()
    
    const getFormattedDate = (date) => {
      if(!date){ return null; }
      date = new Date(date)
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    const debounce = (fn, delay) => {
      let timeout
      return (...args) => {
        if (timeout) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          fn(...args)
        }, delay)
      }
    }

    const searchClient = debounce(async() => {
      const API_URL = import.meta.env.VITE_API
        if(!clientValue.value){
          return clients.value = [];
        }
        let response = await axios.get(`${API_URL}/clients/search/${clientValue.value}`);
        clients.value = response.data
      }, 500);
    

    const taskComments = (task_id) => {
      store.state.show = false
      router.push({name: 'TaskComments', params: {task_id: task_id}})
    } 

    const deleteTask = async(task_id) => {
      const API_URL = import.meta.env.VITE_API
      let response = await axios.post(`${API_URL}/tasks/delete`, {task_id: task_id});
      store.state.show = false
      let tasks = JSON.parse(localStorage.getItem('tasks'))
      if(tasks){
        for(let index in tasks){
          let task = tasks[index]
          if(task.id = task_id){
            tasks.splice(index, 1)
          }
        }  
        localStorage.setItem('tasks', JSON.stringify('tasks'))
      }
      
      if(store.state.tasks){
        for(let index in store.state.tasks){
          let task = store.state.tasks[index]
          if(task.id = task_id){
            store.state.tasks.splice(index, 1)
          }
        }  
      }
    } 


    const searchEmployee = debounce(async() => {
      const API_URL = import.meta.env.VITE_API
      if(!employeeValue.value){
        return employees.value = [];
      }
      let response = await axios.get(`${API_URL}/employees/search/${employeeValue.value}`);
      employees.value = response.data
    }, 500)

    const selectEmployee =  (value) => {
      selectedEmployee.value = value;
      employees.value = [];
      employeeValue.value = `${value.first_name} ${value.last_name}`;
    }

    const selectClient =  (value) => {
      selectedClient.value = value;
      clients.value = [];
      clientValue.value = value.company_name ?  value.company_name : value.name;
    }

    const removeTask = (item) => {
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      for(const index in tasks){
        let task = tasks[index]
        if(task.id == item.id){
            tasks.splice(index, 1)
        }
      }
      localStorage.setItem('tasks', JSON.stringify(tasks))
      store.state.tasks = tasks
    }

    const saveTask = async() => {
      const API_URL = import.meta.env.VITE_API
      const employee = JSON.parse(localStorage.getItem('employee'));
      if(selectedEmployee.value && description.value && employee){
        if(store.state.task.id){
          let task = {
            id: store.state.task.id,
            board_id: store.state.board.id,
            start: store.state.start,
            end: end.value,
            is_recurring: is_recurring.value,
            client_id: selectedClient.value.id,
            employee_id: selectedEmployee.value.id,
            description: description.value,
            is_running: !store.state.task.completed,
            completed: store.state.task.completed
          }
          
          let response = await axios.post(`${API_URL}/tasks/update`, task);
          removeTask(task)
          
        }else{
          let task = {
            start: store.state.start,
            board_id: store.state.board.id,
            end: end.value,
            is_recurring: is_recurring.value,
            client_id: selectedClient.value.id,
            employee_id: selectedEmployee.value.id,
            description: description.value,
            is_running: true,
            recurring_type: recurring_type.value
          }
          let response = await axios.post(`${API_URL}/tasks/save`, task);
          store.state.board.tasks.unshift(response.data);
          store.state.tasks.unshift(response.data);
          localStorage.setItem('tasks', JSON.stringify(store.state.tasks));
        }
        store.state.show  = false
        store.state.edit = false
        store.state.task = {}
      }else{
        alert('Debes asignar la tarea a un empleado');
      }
      
    }


    watchEffect(() => {
      console.log('watchEffect 3 => ', store.state.task)
      if(store.state.edit){
        employeeValue.value = store.state.task.employee
        clientValue.value = store.state.task.client
        end.value = getFormattedDate(store.state.task.end)
        is_recurring.value = getFormattedDate(store.state.task.is_recurring)
        description.value = store.state.task.description
        selectedClient.value = {id: store.state.task.client_id}
        selectedEmployee.value = {id: store.state.task.employee_id}
      }else{
        employeeValue.value = ''
        clientValue.value = ''
        end.value = ''
        store.state.start = ''
        description.value = ''
      }
    })

    return {
      getFormattedDate,
      taskComments,
      deleteTask,
      removeTask,
      recurring_type,
      show,
      end,
      debounce,
      is_recurring,
      description,
      employees,
      selectedEmployee,
      employeeValue,
      selectEmployee,
      searchEmployee,
      clients,
      selectedClient,
      clientValue,
      selectClient,
      searchClient,
      saveTask,
      store,
    }
  },
}
</script>
