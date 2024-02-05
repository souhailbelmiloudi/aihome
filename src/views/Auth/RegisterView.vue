<script setup>
import { ref } from 'vue';
import { auth, createUser, addDataWithCustomId } from '@/firebase/init.js';
import router from '@/router';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);  

const handleErrors = (errorCode) => {
    const errorMessages = {
        'auth/email-already-in-use': 'El correo electrónico ya está en uso',
        'auth/invalid-email': 'El correo electrónico no es válido',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/operation-not-allowed': 'No se ha habilitado el registro'
    };

    return errorMessages[errorCode] || 'Error desconocido. Inténtalo de nuevo.';
}

// Función para el registro de usuario
const authuser = async () => {
    error.value = '';
    loading.value = true;  

    // Validaciones de campos
    if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
        error.value = 'Por favor, ingrese todos los campos';
        loading.value = false;  
        return;
    }

    try {
        const userCredential = await createUser(auth, email.value, password.value);
        const user = userCredential.user;

        if (user) {
            await addDataWithCustomId(user.uid, 'usuarios', {
                name: name.value,
                email: email.value,
                espacios: []
            });
            router.push({ name: 'DashboardView' });
        }
    } catch (errors) {
        // Manejo de errores
        error.value = handleErrors(errors.code);
    } finally {
        loading.value = false;  
    }
}
</script>

<template>
    <div class="container">
        <h1 class="mb-5 mt-3 text-center">
            Crear una cuenta
        </h1>
        <div class="alert alert-danger" role="alert" v-if="error">
            {{ error }}
        </div>
        <form action="#" method="post" @submit.prevent="authuser">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" id="nombre" class="form-control" placeholder="Nombre" v-model="name">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-Mail</label>
                <input type="email" id="email" class="form-control" placeholder="E-Mail" v-model="email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Password" v-model="password">
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span v-else>Crear cuenta</span>
                </button>
            </div>
        </form>
    </div>
</template>
