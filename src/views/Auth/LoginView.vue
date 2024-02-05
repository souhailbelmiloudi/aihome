<script setup>
import { ref } from 'vue'
import { signIn, auth } from '@/firebase/init.js'
import router from '@/router';

const email = ref('')
const password = ref('')
const error = ref(null)

const errorMessages = {
    'auth/invalid-credential': 'Contraseña incorrecta. Verifique su contraseña o correo electrónico.',
    'auth/too-many-requests': 'Demasiados intentos de inicio de sesión fallidos. Inténtalo de nuevo más tarde.',
    'auth/network-request-failed': 'Error de red. Inténtalo de nuevo más tarde.'
}

const authUser = async () => {
    error.value = ''

    try {
        // Validación de campos
        if (!email.value.trim() || !password.value.trim()) {
            error.value = 'Por favor ingrese todos los campos'
            return
        }

        const userCredential = await signIn(auth, email.value, password.value)
        if (userCredential.user) {
            router.push({ name: 'DashboardView' })
        }
    } catch (errors) {
        const errorCode = errors.code
        // Manejo de errores
        error.value = errorMessages[errorCode] || 'Error desconocido. Inténtalo de nuevo.'
    }
}
</script>

<template>
    <div class="container">
        <h1 class="mb-5 mt-3 text-center">
            Iniciar sesión
        </h1>

        <!-- Mostrar mensaje de error si existe -->
        <div :class="{ 'alert alert-danger': error, 'd-none': !error }" role="alert">
            {{ error }} <!-- Mostrar el mensaje de error -->
        </div>

        <!-- Formulario para iniciar sesión -->
        <form action="#" method="post" @submit.prevent="authUser">
            <div class="mb-3">
                <label for="email" class="form-label">E-Mail</label>
                <input type="email" id="email" class="form-control" placeholder="E-Mail" v-model.trim="email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Password" v-model.trim="password">
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Iniciar sesión</button>
            </div>
        </form>
    </div>
</template>
