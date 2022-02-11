<template>
  <TransitionRoot as="template" :show="store.state.open">
    <Dialog as="div" class="fixed inset-0 overflow-hidden z-50" @close="store.state.open = false">
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
            <div class="relative w-screen max-w-2xl">
              <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                  <button type="button" class="rounded-md text-gray-300" @click="store.state.open = false">
                    <span class="sr-only">Close panel</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </TransitionChild>
              <div class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                <div class="px-4 sm:px-6">
                  <DialogTitle class="text-lg font-medium text-gray-900">
                    {{store.state.task.description}}
                  </DialogTitle>
                </div>
                <div class="mt-6 relative flex-1 px-4 sm:px-6">
                  <div class="absolute inset-0 px-4 sm:px-6">
                    <div class="my-2">
                      <p class="text-sm text-gray-500 mb-2">
                        <span>Asignado:</span>
                        <input type="text" class="px-2 w-1/2 border-b border-pink-500 outline-none font-semibold"  v-model="store.state.task.employee_name" @input="searchEmployee" >
                        <ul  id="employee_list" class="shadow-xl w-full">
                          <li class="p-2 hover:bg-gray-100 cursor-pointer" v-for="employee in employees"  @click="selectEmployee(employee)">{{employee.first_name}} {{employee.last_name}}</li>
                        </ul>
                      </p>
                      <p class="text-sm text-gray-500">Fecha de inicio: {{store.state.task.created_at}}</p>
                    </div>
                    <div class="task-comments h-2/3 overflow-y-scroll">
                      <ul>
                        <li v-for="comment in comments" :key="comment.id" class="py-2 border-b">
                          <div class="text-sm text-gray-600">
                            <span class="text-pink-600 font-semibold">{{comment.employee_name}}</span>
                            <span class="ml-2">{{comment.created_at}}</span>
                          </div>
                          <p class="text-gray-600">{{comment.description}}</p>
                      </li>
                      </ul>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full px-2">
                      <textarea class="w-full border-gray-100 text-gray-600 border rounded-md p-2" v-model="description"  rows="2" placeholder="Haz una pregunta o agrega un comentario"></textarea>
                      <button class="bg-pink-600 text-white w-full p-2" @click="saveTaskComment">Guardar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'
import { inject, ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  },
  setup() {
    const open = ref(true)
    const store = inject('store')
    const employees = ref([]);
    const selectedEmployee = ref({})
    const comments = ref([])
    const description = ref('')

    const selectEmployee =  async(value) => {
      store.state.task.employee_name = `${value.first_name} ${value.last_name}`
      store.state.task.employee_id = value.id
      employees.value = []
      const data = {
        employee_id: value.id,
        task_id: store.state.task.id
      }
      let response = await axios.post('https://kmmotos.miposvirtual.com/apirest/tasks/employees/update', data)

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
      if(!store.state.task.employee_name){
        return employees.value = [];
      }
      let response = await axios.get('https://kmmotos.miposvirtual.com/apirest/employees/search/' + store.state.task.employee_name);
      employees.value = response.data
    }, 500)

     const saveTaskComment = async() => {
      if(!description.value){
        return;
      }
      const employee = JSON.parse(localStorage.getItem('employee'))
      const taskComment = {
        id: new Date().getTime(),
        task_id: store.state.task.id,
        employee_id: employee.id,
        client_id: store.state.task.client_id,
        client_name: store.state.task.client_name,
        employee_name: `${employee.first_name} ${employee.last_name}`,
        description: description.value,
        created_at: getToday()
      }
      
      let taskComments = JSON.parse(localStorage.getItem('task_comments'))
      taskComments = taskComments || []
      taskComments.push(taskComment)
      localStorage.setItem('task_comments', JSON.stringify(taskComments))
      comments.value.unshift(taskComment)
      let response = await axios.post('https://kmmotos.miposvirtual.com/apirest/tasks/comment/save', taskComment);
      description.value = ''
    }

    const getToday = () => {
      return moment().format('YYYY-MM-DD HH:mm')
    }

    watchEffect(async() => {
      description.value = ''
      if(store.state.task){
        let response = await axios.get('https://kmmotos.miposvirtual.com/apirest/tasks/comments/' + store.state.task.id)  
        comments.value = response.data
      }
      
    })

    return {
      open,
      store,
      debounce,
      description,
      comments,
      employees,
      selectEmployee,
      searchEmployee,
      saveTaskComment,
      getToday
    }
  },

}
</script>