<template>
    <div class="container mt-5">
        <h1 class="mb-5 mt-3 text-center">
            Dashboard {{ nombre }}
        </h1>
        <LosEspacios/>
    </div>     
</template>

<script setup>
 import { ref } from 'vue';
 import {
    getDataDocument,
    auth, 
      

} from '../firebase/init';

import LosEspacios from '@/components/LosEspacios.vue';
const tableUser = "usuarios";
const idUser = ref(auth.currentUser.uid);
const nombre = ref("");
 const recuperarDatos = async () => {
     const user = await getDataDocument(idUser.value, tableUser);
    
     nombre.value = user.data().name;
 };

recuperarDatos();
</script>

