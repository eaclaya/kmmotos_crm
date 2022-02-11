<template>
  <Nav />
  <Task />
  <FullCalendar :options="calendarOptions"  />
</template>

<script>
import Task from './components/Task.vue'
import Nav from './components/Nav.vue'
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
import { inject, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

export default {
  components: {
    FullCalendar,
    Task,
    Nav
  },

  setup() {
    const router = useRouter()
    if (!localStorage.getItem('employee')) {
        router.push('/login');
    }
    const store = inject('store')

    const showTask = (arg) => {
      store.state.show = true
      store.state.edit = false
      store.state.start = arg.dateStr
      store.state.task = {}
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

    const editTask = (info) => {
      let task_id = info.event.id
      store.state.task = getTask(task_id)
      store.state.start = getFormattedDate(store.state.task.start)
      store.state.show = true
      store.state.edit = true
    }



    const loadEvents = async() => {
      const employee = JSON.parse(localStorage.getItem('employee'));
      if(employee){
        let response = await axios.get('https://kmmotos.miposvirtual.com/apirest/tasks/' + employee.id);
        for(const index in response.data){
          response.data[index].is_running = response.data[index].is_running ? true : false
          response.data[index].completed = response.data[index].completed ? true : false
          response.data[index].is_recurring = response.data[index].is_recurring ? true : false
        }
        store.state.tasks = response.data
        localStorage.setItem('tasks', JSON.stringify(response.data));
        return response.data;  
      }
      return [];
    }

    return {
      store,
      getTask,
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: showTask,
        eventClick: editTask,
        events: loadEvents
      },
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
