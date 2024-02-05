import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './firebase/init'

let app = null

// wait for firebase auth to init before creating the app
// this ensures any auth related routes are protected until
// firebase auth is ready to go
auth.onAuthStateChanged(() => {
  // init app if not already created
  if (!app) {
    app = createApp(App).use(router).mount('#app')
    }
})

//createApp(App).use(router).mount('#app')

