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
            <span class="brand-id">
                
            </span>
        </h1>
      <div class="row">
        <!--
          culumna de sensores
        -->
      <div class="col-md-6 border border-2 border-dark rounded-5 ml-5 mr-5 p-3">
        <h2>Sensores</h2>
        <div class="card scroll" style="height: 300px">
          <ul class="list-group list-group-flush">
            <!--
              Lista de sensores
            -->
            <li v-for="sensor in espacioIdDeseado.sensores" :key="sensor.id" class="list-group-item">
              <p class="brand-id">{{ sensor.id }}</p>
              {{ sensor.nombre }} : {{ sensor.valor }} {{ sensor.unidadMedida }} 
              <button class="btn btn-primary btn-sm ms-3"
                  @click="abrirDispositivo(sensor.id, 'sensores', idUser, espacioIdDeseado.id)">
                  Ver dispositivo
              </button>
            </li>
          </ul>
        </div>
      </div>
      <!--
        culumna de ejecutores
      -->
      <div class="col-md-6 border border-2 border-dark rounded-5 ml-5 mr-5 p-3">
        <h2>Ejecutores</h2>
        <div class="card scroll" style="height: 300px">
          <!--
            Lista de ejecutores
          -->
          <ul class="list-group list-group-flush">
            <li v-for="ejecutor in espacioIdDeseado.ejecutores" :key="ejecutor.id" class="list-group-item">
                 <p class="brand-id">{{ ejecutor.id }}</p>
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
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999999;
}

/* Specific styling for the `col-md-6` divs */
.col-md-6 {
  border-radius: 10px;
  background-color: #f5f5f5; /* Replace with desired base color */
  padding: 1rem; /* Adjust padding as needed */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.col-md-6 > h2 {
  margin-bottom: 1rem; /* Adjust margin as needed */
  font-size: 1.2rem; /* Adjust font size as needed */
}

/* Card styling */
.card {
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: 300px; /* Set a maximum height for the scrollable area */
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.card ul {
  list-style: none; /* Remove default list style */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}

.card li {
  padding: 0.5rem 1rem; /* Adjust padding as needed */
  border-bottom: 1px solid #ddd;
  transition: all 0.2s ease-in-out; /* Add smooth hover effect */
}

.card li:hover {
  background-color: #eee; /* Add subtle hover background */
}

/* List item styling */
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align vertically */
}

.brand-id {
  font-weight: bold;
  margin-right: 0.5rem; /* Adjust spacing as needed */
}

.estadoEjecutor { /* Assuming this class exists or you choose a different one */
  color: #888; /* Adjust color as needed */
  font-style: italic;
}

.btn-primary {
  background-color: #28a745; /* Customize primary button color */
  border-color: #28a745; /* Customize primary button border */
}

/* Optional customization: Remove default card background and padding */
.card {
  background-color: transparent;
  padding: 0;
}

.card li {
  background-color: #fff; /* Use desired background color */
}

.brand-id{
    color: cadetblue;

}

.title {
    cursor: pointer;
}
.card {
  overflow-y: auto; /* Activar scroll vertical */
  max-height: 300px; /* Establecer altura máxima */
}

.col-md-6:first-child {
  background-color: #3498db;
}

.col-md-6:last-child {
  background-color: #3ce7d0;
}

</style>
