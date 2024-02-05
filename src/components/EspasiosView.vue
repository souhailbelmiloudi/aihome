<script setup>
import { ref, onMounted } from 'vue';
import { auth, getDataChanged_document } from '../firebase/init';
import { useRouter } from 'vue-router';
import { estadoEjecutor, mostrarError } from '../helpers/funciones';

// Variables y referencias
const router = useRouter();
const tableUser = "usuarios";
const idUser = ref(auth.currentUser.uid);
const espacios = ref([]);
const espacioIdDeseado = ref({});
const id = ref("");

// Función para obtener datos desde la URL
const obtenerDatosDesdeURL = () => {
    try {
        id.value = router.currentRoute.value.params.id || "";
    } catch (error) {
        mostrarError("Error al obtener datos desde la URL", error);
    }
};

// Función para recuperar datos del documento
const recuperarDatos = (datos) => {
    try {
        espacios.value = datos.data().espacios;
        espacioIdDeseado.value = espacios.value.find((espacio) => espacio.id == id.value) || null;
    } catch (error) {
        mostrarError("Error al recuperar datos", error);
    }
};

// Llamada a recuperarDatos al montar el componente
onMounted(() => {
    obtenerDatosDesdeURL();
    getDataChanged_document(tableUser, idUser.value, recuperarDatos);
});

// Función para abrir un dispositivo
const abrirDispositivo = (id, tipo, idUser, idEspacio) => {
    window.open(`https://souhailbelmiloudi.github.io/SmartHomeAdmin/detalle-dispositivo/${idUser}/${idEspacio}/${tipo}/${id}`);
};

// Función para abrir un espacio
const abrirEspacio = (idEspacio, idUser) => {
    window.open(`https://souhailbelmiloudi.github.io/SmartHomeAdmin/espacio/${idUser}?espacioId=${idEspacio}`);
};
</script>

<template>
    <div v-if="espacioIdDeseado" class="container mt-5">
        <!-- Encabezado del espacio -->
        <h1 @click="abrirEspacio(espacioIdDeseado.id, idUser)"
            class="mb-5 mt-3 text-center border border-2 border-dark rounded-5 p-3 bg-primary text-white shadow p-3 mb-5  rounded title">
            {{ espacioIdDeseado.nombre }}
        </h1>
        <div class="row">
            <!-- Columna de Sensores -->
            <div class="col-md-6 border border-2 border-dark rounded-5 ml-5 mr-5 p-3"
                :style="{ backgroundColor: '#3498db', height: '200px' }">
                <h2>Sensores</h2>
                <div class="card scroll">
                    <ul class="list-group list-group-flush">
                        <!-- Lista de Sensores -->
                        <li v-for="sensor in espacioIdDeseado.sensores" :key="sensor.id" class="list-group-item">
                            {{ sensor.nombre }} : {{ sensor.valor }} {{ sensor.unidadMedida }}
                            <button class="btn btn-primary btn-sm ms-3"
                                @click="abrirDispositivo(sensor.id, 'sensores', idUser, espacioIdDeseado.id)">
                                Ver dispositivo
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Columna de Ejecutores -->
            <div class="col-md-6 border border-2 border-dark rounded-5 ml-5 mr-5 p-3"
                :style="{ backgroundColor: '#3ce7d0', height: '200px' }">
                <h2>Ejecutores</h2>
                <div class="card scroll">
                    <ul class="list-group list-group-flush">
                        <!-- Lista de Ejecutores -->
                        <li v-for="ejecutor in espacioIdDeseado.ejecutores" :key="ejecutor.id" class="list-group-item">
                            {{ ejecutor.nombre }} : {{ estadoEjecutor(ejecutor.estado) }}
                            <button class="btn btn-primary btn-sm ms-3"
                                @click="abrirDispositivo(ejecutor.id, 'ejecutores', idUser, espacioIdDeseado.id)">
                                Ver dispositivo
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container mt-5">
        <!-- Mensaje si no se encuentra el espacio -->
        <h1 class="mb-5 mt-3 text-center">No se encontró el espacio</h1>
    </div>
</template>

<style scoped>
.scroll {
    overflow-y: auto;
    max-height: 200px;
}

.title {
    cursor: pointer;
}
</style>
