<template>
  <Nav />
  <TaskTable />   
  <Task />
</template>

<script>
import Task from './components/Task.vue'
import TaskTable from './components/TaskTable.vue'
import Nav from './components/Nav.vue'
import axios from 'axios'

export default {
  components: {
    Task,
    TaskTable,
    Nav
  },
  setup(){
    if (!localStorage.getItem('employee')) {
        this.$router.push('/login');
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
