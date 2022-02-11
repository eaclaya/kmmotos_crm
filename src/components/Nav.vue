<template>
  <Disclosure as="nav" class="bg-green-600" v-slot="{ open }">
    <div class="mx-auto px-2 sm:px-6 lg:px-8 mb-4">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center md:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton class="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          </DisclosureButton>
        </div>
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0 flex items-center">
            <a href="https://kmmotos.miposvirtual.com"><img class="h-8 w-auto" src="https://kmmotos.miposvirtual.com/images/kmmotos.svg" alt="Workflow" /></a>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <a class="bg-white text-pink-600 py-2 px-4 rounded-md" href="https://kmmotos.miposvirtual.com">Volver al Sistema</a>
              <router-link  v-for="item in navigation" :key="item.name" :to="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-100 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</router-link>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button type="button" class="hidden sm:block bg-white p-2 rounded-lg text-pink-700 hover:bg-gray-100 hover:text-pink-500" @click="signOut">
                Cerrar sesion
          </button>
          <button class="ml-4 relative" @click="showNotifications">
            <span class="flex h-3 w-3 absolute top-0 right-0" v-if="store.state.notifications.length > 0">
              <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-600"></span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button> 
          <ul class="absolute top-16 right-0 w-92 z-50 group" v-if="store.state.visible">
            <li class="text-sm my-2 p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-pink-600 hover:text-white"  v-for="notification in store.state.notifications" :key="notification.id" @click="showTaskDetail(notification)">
              <span class="font-semibold">{{notification.description}}</span>&nbsp;
              <span class="text-pink-600">{{notification.created_at}}</span></li>
          </ul>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
        <a class="text-white" @click="signOut">Cerrar sesion</a>    
      </div>
    </DisclosurePanel>
  </Disclosure>
  <TaskPanel />
</template>
<style>
  .fc-toolbar-title {
    font-size: 1.5rem !important;
  }
</style>
<script>
import {ref,inject} from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TaskPanel from './TaskPanel.vue'

const navigation = [
  { name: 'Calendario', href: '/', current: true },
  { name: 'Tareas', href: '/tasks', current: false },
  { name: 'Tableros', href: '/boards', current: false },
]

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TaskPanel
  },
  
  setup(context, props) {
    const router = useRouter()
    const store = inject('store')
    const notifications = ref([])
    const visible = ref(true)
    for(const item of navigation){
      item.current = false;
      if(item.href == window.location.pathname){
        item.current = true;
      }
    }
    const showTaskDetail = async(item) => {
      const API_URL = import.meta.env.VITE_API
      let tasks = JSON.parse(localStorage.getItem('tasks'))
      let task = null
      for(const _task of tasks){
        if(_task.id == item.task_id){
          task = _task
        }
      }
      if(task){
        store.state.open = true
        store.state.visible = false
        store.state.task = task  
        store.state.notifications = store.state.notifications.filter((notification) => item.id != notification.id)
        localStorage.setItem('notifications',JSON.stringify(store.state.notifications)) 
        await axios.get(`${API_URL}/tasks/notifications/update/${item.id}`);
      }
      
    
    }

    const signOut = () => {
      localStorage.removeItem('employee');
      router.push('/login');
    }
    const showNotifications = () => {
      visible.value = !visible.value
      store.state.visible = !store.state.visible
    }
    
    return {
      navigation,
      store,
      open,
      signOut,
      showNotifications,
      notifications,
      showTaskDetail
    }
  },
  async created(){
    const API_URL = import.meta.env.VITE_API
    const employee = JSON.parse(localStorage.getItem('employee'));
    console.log('created employee => ', employee)
    let response = await axios.get(`${API_URL}/tasks/notifications/${employee.id}`);
    localStorage.setItem('notifications', JSON.stringify(response.data));
    this.store.state.notifications = response.data
    if(employee.task_id){
      let tasks = JSON.parse(localStorage.getItem('tasks'))
      let task = null
      for(const _task of tasks){
        if(_task.id == employee.task_id){
          task = _task
        }
      }
      delete employee.task_id
      localStorage.setItem('employee', JSON.stringify(employee))
      if(task){
        this.store.state.open = true
        this.store.state.visible = false
        this.store.state.task = task  
      } 
    }
  }
}
</script>