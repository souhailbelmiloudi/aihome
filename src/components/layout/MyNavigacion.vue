<script setup>
import { ref } from 'vue'
import { auth  } from '@/firebase/init.js'
import router from '@/router'


const isAuthenticated = ref(false)
auth.onAuthStateChanged((user) => {
  if (user) {
    isAuthenticated.value = true
  } else {
    isAuthenticated.value = false
  }
})
// cerra sesion

const logout = async () => {
  await auth.signOut()
  isAuthenticated.value = false
  router.push({ name: 'Login' })
}





</script>

<template lang="">
    <div class="container">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <routerLink class="navbar-brand" to="/aihome">MyHome</routerLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <div class="nav-item" v-if="!isAuthenticated">
              <routerLink class="nav-link active" aria-current="page" to="/aihome">Home</routerLink>
              </div>
             
            </li>
          </ul>

          

          <div class="nav-item" v-if="!isAuthenticated">
            <routerLink class="btn btn-outline-success me-2" to="/aihome/login">Login</routerLink>
            <routerLink class="btn btn-outline-success" to="/aihome/register">Register</routerLink>
         </div>
           <div class="nav-item dropdown" v-if="isAuthenticated">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{auth.currentUser.email}}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><routerLink class="dropdown-item"  to="/aihome/Perfil">Perfil</routerLink></li>
              <li><routerLink class="dropdown-item" to="/aihome/dashboard">Dachboard</routerLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item"  @click="logout">Cerrar Sesion</a></li>
            </ul>
         </div> 

        </div>
        
      </div>
    </nav>
    </div>
</template>