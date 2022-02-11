<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-24 w-auto" src="https://kmmotos.miposvirtual.com/logo/F0CVzjgsFWsc8s7ikCxDAhnsz6hY9bz6FF.jpeg" alt="Workflow" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        </h2>
      </div>
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="access-code" class="sr-only">Codigo de acceso</label>
            <input id="access-code" name="text" type="text"  required="" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm" placeholder="Codigo de acceso" v-model="employeeValue" />
          </div>
        </div>

        <div>
          <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-spin mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <button v-else type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500" @click="getEmployee">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3" >
            </span>
            Ingresar
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup(){
    const router = useRouter()
    const route = useRoute()
    const token = ref(route.params.token)
    const loading = ref(false)
  	const employeeValue = ref('');
  	const getEmployee = async() => {
  		let response = await axios.get('https://kmmotos.miposvirtual.com/apirest/employees/get/' + employeeValue.value);
  		if(response.data && response.data.id){
  			localStorage.setItem('employee', JSON.stringify(response.data));
  			return router.push('/');	
  			
  		}
      alert("Codigo incorrecto");
    	return response.data;
  	}

  	return {
      token,
      router,
      loading,
  		getEmployee,
  		employeeValue
  	}
  },
  async created(){
    if(this.token){
      this.loading = true
      let response = await axios.get('https://kmmotos.miposvirtual.com/apirest/employees/token/' + this.token);  
      if(response.data && response.data.id){
        localStorage.setItem('employee', JSON.stringify(response.data));
        return this.router.push('/');  
        
      }
      alert("Codigo incorrecto");
      return response.data;
    }
    
  }
}
</script>