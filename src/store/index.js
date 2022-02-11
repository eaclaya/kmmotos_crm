import { reactive } from 'vue'

const state = reactive({
	tasks: [],
	task: {},
    board: {},
    boards: [],
    notifications: [],
	show: false,
    open: false,
	start: '',
	edit: false,
    visible: false
})

const methods =
{
	hideTask: () => {
		console.log('hideTask => ', state.show);
    	state.show = false;
    },
    showTask: (date) => {
    	console.log('showTask => ', state.show);
    	date = date ? date : getToday()
    	state.show = true;
    	state.start = date
    },
    getToday: () => {
    	const todayDate = new Date().toISOString().slice(0, 10);
    	return todayDate;
    }
}

export default {
	state
}