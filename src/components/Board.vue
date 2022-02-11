<template>
<TransitionRoot class="board-wrapper" as="template"  :show="store.state.show">
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
                    Tablero
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      <div class="input-wrapper">
                        <p class="mt-2">Nombre</p>
                        <input type="text" class="px-2 py-2 rounded-md w-full border" v-model="name" /> 
                      </div> 
                      <div class="input-wrapper">
                        <p class="mt-2">Empleado</p>
                        <input type="text" class="px-4 py-2 w-full rounded-md border" v-model="employeeValue" @input="searchEmployee" placeholder="Escribe nombre y presiona ENTER">
                        <ul  id="employee_list" class="shadow-xl w-full">
                          <li class="p-2 hover:bg-gray-100 cursor-pointer" v-for="employee in employees"  @click="selectEmployee(employee)">{{employee.first_name}} {{employee.last_name}}</li>
                        </ul>
                      </div>   
                      <div class="input-wrapper pt-4" v-if="employeesList.length > 0">
                        <p class="font-bold">* Acceso privado</p>
                        <ul class="board-employees">
                          <li v-for="employee in employeesList" :key="employee.id" class="bg-gray-100 rounded-lg my-2 p-2 relative">
                            {{employee.first_name}} {{employee.last_name}}
                            <button class="absolute top-1 right-2" @click="removeBoardEmployee(employee)">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="rgba(219, 39, 119)">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div class="input-wrapper pt-4" v-else>
                        <p class="font-bold">* Acceso publico</p>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm" @click="saveBoard">
                Guardar
              </button>

              <button v-if="store.state.board.id" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 border-red-700 text-base font-medium text-red-700 hover:bg-red-700 hover:text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"  @click="deleteBoard(store.state.board.id)">
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
    const name = ref('');
    const clients = ref([]);
    const selectedClient = ref([]);
    const clientValue = ref('');
    const store = inject('store')
    const show = ref(false);
    const recurring_type = ref('');
    const router = useRouter()
    const employeesList = ref([])
    const getFormattedDate = (date) => {
      if(!date){ return null; }
      date = new Date(date)
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    watchEffect(() => {
      if(store.state.edit){
        employeeValue.value = store.state.board.employee
        clientValue.value = store.state.board.client
        end.value = getFormattedDate(store.state.board.end)
        is_recurring.value = getFormattedDate(store.state.board.is_recurring)
        name.value = store.state.board.name
        selectedClient.value = {id: store.state.board.client_id}
        selectedEmployee.value = {id: store.state.board.employee_id}
      }else{
        employeeValue.value = ''
        clientValue.value = ''
        end.value = ''
        store.state.start = ''
        name.value = ''
      }
    })

    const deleteBoard = async(board_id) => {
      const API_URL = import.meta.env.VITE_API
      let response = await axios.post(`${API_URL}/boards/delete`, {board_id: board_id});
      store.state.show = false
      let boards = JSON.parse(localStorage.getItem('boards'))
      if(boards){
        for(let index in boards){
          let board = boards[index]
          if(board.id = board_id){
            boards.splice(index, 1)
          }
        }  
        localStorage.setItem('boards', JSON.stringify('boards'))
      }
      
      if(store.state.boards){
        for(let index in store.state.boards){
          let board = store.state.boards[index]
          if(board.id = board_id){
            store.state.boards.splice(index, 1)
          }
        }  
      }
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
      let valid = true
      for(let employee of employeesList.value){
        if(employee.id == value.id){
          valid = false
        }
      }
      if(valid){
        employeesList.value.push(value);  
      }
      employeeValue.value = ''
    }

    const searchClient = async() => {
      const API_URL = import.meta.env.VITE_API
      if(!clientValue.value){
        return clients.value = [];
      }
      let response = await axios.get(`${API_URL}/clients/search/${clientValue.value}`);
      clients.value = response.data
    }

    const selectClient =  (value) => {
      selectedClient.value = value;
      clients.value = [];
      clientValue.value = value.company_name ?  value.company_name : value.name;
    }

    const removeBoard = (item) => {
      let boards = JSON.parse(localStorage.getItem('boards'));
      for(const index in boards){
        let board = boards[index]
        if(board.id == item.id){
            boards.splice(index, 1)
        }
      }
      localStorage.setItem('boards', JSON.stringify(boards))
      store.state.boards = boards
    }

    const removeBoardEmployee = (item) => {
      for(const index in employeesList.value){
        const employee = employeesList.value[index]
        if(employee.id == item.id){
            employeesList.value.splice(index, 1)
        }
      }
    }

    const saveBoard = async() => {
      const API_URL = import.meta.env.VITE_API
      const employee = JSON.parse(localStorage.getItem('employee'));
      if(name.value){
        if(store.state.board.id){
          let board = {
            id: store.state.board.id,
            name: name.value,
            employees: employeesList.value
          }
            
          let response = await axios.post(`${API_URL}/boards/update`, board);
          removeBoard(board)
          
        }else{
          let board = {
            name: name.value,
            employees: employeesList.value
          }
          let response = await axios.post(`${API_URL}/boards/save`, board);
          store.state.boards.unshift(response.data);
          employeesList.value = []
          name.value = []
          localStorage.setItem('boards', JSON.stringify(store.state.boards));
        }
        store.state.show  = false
      }else{
        alert('Escribe el nombre del tablero');
      }
      
    }

    return {
      getFormattedDate,
      deleteBoard,
      removeBoard,
      debounce,
      name,
      employeesList,
      removeBoardEmployee,
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
      saveBoard,
      store,
    }
  },
}
</script>
