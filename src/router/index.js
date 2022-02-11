import {createRouter, createWebHistory} from 'vue-router'
import Calendar from '../Calendar.vue'
import Login from '../Login.vue'
import Boards from '../Boards.vue'
import BoardTasks from '../BoardTasks.vue'
import TaskDetail from '../TaskDetail.vue'
import Tasks from '../Tasks.vue'
import TaskComments from '../TaskComments.vue'
import PageNotFound from '../PageNotFound.vue'
import auth from '../middleware/auth'
import log from '../middleware/log'

const routes = [
	{
		path: '/',
		name: 'Calendar',
		component: Calendar,
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/login/token/:token',
		name: 'LoginById',
		component: Login
	},
	{
		path: '/boards',
		name: 'Boards',
		component: Boards
	},
	{
		path: '/boards/tasks/:board_id',
		name: 'BoardTasks',
		component: BoardTasks
	},
	{
		path: '/tasks',
		name: 'Tasks',
		component: Tasks,
	},
	{
		path: '/tasks/:task_id',
		name: 'TaskDetail',
		component: TaskDetail,
	},
	
	{
		path: '/tasks/comments/:task_id',
		name: 'TaskComments',
		component: TaskComments,
	},
	{
	    path: '/:catchAll(.*)*',
	    name: "PageNotFound",
	    component: PageNotFound,
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes, 
})

export default router;