<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { auth, getDataChanged_document, updateData } from '../firebase/init';
import { generarIdSimple } from '../helpers/generarIdSimple.js';
import { mostrarError } from '../helpers/funciones.js';


// Definición de constantes
const tableUser = "usuarios";
const idUser = ref(auth.currentUser.uid);
const espacios = ref([]);

/**
 * Función para recuperar los datos de un documento
 * @param {snapshot} datos - Datos del documento
 * 
 */
const recuperarDatosa = (datos) => {
    try {
        espacios.value = datos.data().espacios;
        localStorage.setItem('user', JSON.stringify(datos.data()));
    } catch (error) {
        mostrarError("Error al recuperar datos", error);

    }
};
getDataChanged_document(tableUser, idUser.value, recuperarDatosa);

// Función para actualizar los datos de un documento
const actualizarDatos = () => {
    updateData(idUser.value, tableUser, { espacios: [...espacios.value] });

};

////////////////////////////////----Funciones para los dispositivos----////////////////////////////////////

/**
 * funciones para actualizar el estado de los ejecutores
 * @param {Object} ejecutor - Ejecutor a modificar
 */
const toggleEstado = (ejecutor) => {
    ejecutor.estado = !ejecutor.estado;
    actualizarDatos();
};

/**
 * Función para modificar el nombre de un dispositivo
 * @param {Object} dispositivo - Dispositivo a modificar
 * 
 */
const cambiarNombre = (dispositivo) => {
    if (dispositivo.tipo == "sensor") {
        Swal.fire({
            title: 'Ingrese el nuevo nombre del Sensor',
            html: `
                <input id="swal-input-nombre" class="swal2-input" placeholder="Nuevo nombre" value="${dispositivo.nombre}">
                <input id="swal-input-valor" class="swal2-input" placeholder="Valor de referencia" value="${dispositivo.valor}" disabled>
                <input id="swal-input-unidad" class="swal2-input" placeholder="Unidad de medida" value="${dispositivo.unidadMedida}" disabled>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nuevoNombre = Swal.getPopup().querySelector('#swal-input-nombre').value;


                if (!nuevoNombre) {
                    Swal.showValidationMessage('Por favor, ingresar todos los campos');
                }

                return { nuevoNombre };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                dispositivo.nombre = result.value.nuevoNombre;
                actualizarDatos();
            }
        });
    } else {
        Swal.fire({
            title: 'Ingrese el nuevo nombre del Ejecutor',
            input: 'text',
            inputLabel: 'Nuevo nombre',
            inputValue: dispositivo.nombre,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Por favor, ingrese un nuevo nombre';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                dispositivo.nombre = result.value;
                actualizarDatos();
            }
        });
    }
};

/**
 * Función para eliminar un dispositivo
 * @param {Object} dispositivo - Dispositivo a eliminar
 * 
 */
const eliminar = (dispositivo) => {
    Swal.fire({
        title: '¿Está seguro de eliminar este dispositivo?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            espacios.value.forEach((espacio) => {
                if (espacio.sensores.includes(dispositivo)) {
                    espacio.sensores.splice(espacio.sensores.indexOf(dispositivo), 1);
                } else if (espacio.ejecutores.includes(dispositivo)) {
                    espacio.ejecutores.splice(espacio.ejecutores.indexOf(dispositivo), 1);
                }
            });
            actualizarDatos();
        }
    });
}


/**
 * Función para agregar un ejecutor
 * @param {String} NombreEspa - Nombre del espacio al que se le agregará el ejecutor
 * 
 */
const addEjecutoe = (NombreEspa) => {
    Swal.fire({
        title: 'Ingrese el nombre del nuevo ejecutor',
        input: 'text',
        inputLabel: 'Nombre',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingrese un nombre';
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            espacios.value.forEach((espacio) => {
                if (espacio.nombre == NombreEspa) {
                    espacio.ejecutores.push({
                        id: generarIdSimple(),
                        nombre: result.value,
                        estado: false,
                        tipo: "ejecutor"
                    });
                }
            });
            actualizarDatos();
        }
    });
};

/**
 * Función para agregar un sensor
 * @param {String} NombreEspa - Nombre del espacio al que se le agregará el sensor
 * 
 */
const addSensor = (NombreEspa) => {
    Swal.fire({
        title: 'Ingrese el nombre del nuevo sensor',
        html: `
            <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre">
            <input id="swal-input-valor" class="swal2-input" placeholder="Valor de referencia">
            <select id="swal-select-unidad" class="swal2-select" placeholder="Unidad de medida">
                <option value="°C">ºC</option>
                <option value="°F">ºF</option>
                <option value="%">%</option>
                <option value="ppm">ppm</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#swal-input-nombre').value;
            const valor = Swal.getPopup().querySelector('#swal-input-valor').value;
            const unidadMedida = Swal.getPopup().querySelector('#swal-select-unidad').value;

            if (!nombre || !valor || !unidadMedida) {
                Swal.showValidationMessage('Por favor, ingresar todos los campos');
            }

            return { nombre, valor, unidadMedida };
        },
    }).then((result) => {
        if (result.isConfirmed) {
            espacios.value.forEach((espacio) => {
                if (espacio.nombre == NombreEspa) {
                    espacio.sensores.push({
                        id: generarIdSimple(),
                        nombre: result.value.nombre,
                        valor: result.value.valor,
                        unidadMedida: result.value.unidadMedida,
                        tipo: "sensor"
                    });
                }
            });
            actualizarDatos();
        }
    });
};


////////////////////////////////----Funciones para los espacios----////////////////////////////////////

/**
 * Función para agregar un espacio
 * 
 */
const addSpace = () => {
    Swal.fire({
        title: 'Ingrese el nombre del nuevo espacio',
        input: 'text',
        inputLabel: 'Nombre',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingrese un nombre';
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            espacios.value.push({
                id: generarIdSimple(),
                nombre: result.value,
                ejecutores: [],
                sensores: []
            });
            actualizarDatos();
        }
    });
};

/**
 * función para eliminar un espacio
 * @param {String} nombre - Nombre del espacio a eliminar
 */
const eliminarEspacio = (nombre) => {
    Swal.fire({
        title: '¿Está seguro de eliminar este espacio?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            espacios.value.forEach((espacio) => {
                if (espacio.nombre == nombre) {
                    espacios.value.splice(espacios.value.indexOf(espacio), 1);
                }
            });
            actualizarDatos();
        }
    });
}

/**
 * Función para modificar el nombre de un espacio
 * @param {String} nombre - Nombre del espacio a modificar
 */

const modificarEspacio = (nombre) => {
    Swal.fire({
        title: 'Ingrese el nuevo nombre del espacio',
        input: 'text',
        inputLabel: 'Nombre',
        showCancelButton: true,
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingrese un nombre';
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            espacios.value.forEach((espacio) => {
                if (espacio.nombre == nombre) {
                    espacio.nombre = result.value;
                }
            });
            actualizarDatos();
        }
    });
}

</script>

<template>
    <!-- Botón para agregar un espacio -->
    <div class="mb-3">

        <button class="btn btn-primary" @click="addSpace">Agregar Espacio</button>
    </div>
    <div>
        <!-- Lista de espacios -->
        <div v-for="espacio in espacios" :key="espacio.nombre">
            <nav class="navbar mb-2 esp" :id="'esp' + espacio.nombre.replace(/\s/g, '')">
                <div class="container">
                    <a class="navbar-brand" data-bs-toggle="collapse"
                        :data-bs-target="'#navbarNav' + espacio.nombre.replace(/\s/g, '')">
                        {{ espacio.nombre }}
                        <span class="brand-id">
                             {{ espacio.id}}
                        </span>
                    </a>
                    <!-- Botón de hamburguesa para pantallas pequeñas -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#navbarNav' + espacio.nombre.replace(/\s/g, '')"
                        aria-controls="'navbarNav' + espacio.nombre.replace(/\s/g, '')" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <!--Lista de Ejecutores y Sensores -->
                    <div class="collapse navbar-collapse" :id="'navbarNav' + espacio.nombre.replace(/\s/g, '')">
                        <ul class="navbar-nav">
                            <!-- Lista de Ejecutores -->
                            <li class="nav-item dropdown">
                                <a class="nav-link " href="" id="navbarDropdownEjecutores" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Ejecutores
                                </a>
                                <ul class="dropdown-menu">
                                    <li v-for="ejecutor in espacio.ejecutores" :key="ejecutor.id" class="dropdown-item ">
                                        <div class="form-check">
                                            <!-- Checkbox para activar o desactivar el ejecutor -->
                                            <input class="l" type="checkbox" :checked="ejecutor.estado"
                                                @change="toggleEstado(ejecutor)">
                                            <!-- Nombre del ejecutor -->
                                            <div class="ms-2 d-flex align-items-center">
                                                <p class="mb-0">{{ ejecutor.nombre }}</p>
                                                <p class="mb-0 ms-3">{{ ejecutor.estado ? 'Activado' : 'Desactivado' }}</p>
                                                <!-- Botones de configuración del ejecutor -->
                                                <button class="btn btn-primary ms-3" @click="cambiarNombre(ejecutor)">
                                                    <i class="bi bi-pencil">Modificar</i>
                                                </button>
                                                <button class="btn btn-danger ms-3" @click="eliminar(ejecutor)">
                                                    <i class="bi bi-trash">Eliminar</i>
                                                </button>
                                            </div>
                                        </div>

                                    </li>
                                </ul>

                            </li>
                            <!-- Lista de Sensores -->
                            <li class="nav-item dropdown">
                                <a class="nav-link " href="#" id="navbarDropdownSensores" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Sensores
                                </a>
                                <ul class="dropdown-menu">
                                    <li v-for="sensore in espacio.sensores" :key="sensore.id" class="dropdown-item">
                                        <div class="ms-2 d-flex align-items-center">
                                            <p class="mb-0">{{ sensore.nombre }} :</p>
                                            <p class="mb-0 ms-3">{{ sensore.valor }} {{ sensore.unidadMedida }}</p>
                                            <!-- Botones de configuración del sensor -->
                                            <button class="btn btn-primary ms-3" @click="cambiarNombre(sensore)">
                                                <i class="bi bi-pencil">Modificar</i>
                                            </button>
                                            <p class="mb-0 ms-3"></p>
                                            <button class="btn btn-danger ms-3" @click="eliminar(sensore)">
                                                <i class="bi bi-trash">Eliminar</i>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <!-- Botones de agregar y eliminar -->
                        <div class="mb-3 mt-3 text-center btn-group">
                            <button class="btn btn-primary" @click="addEjecutoe(espacio.nombre)"
                                :id="espacio.nombre">Agregar Ejecutor</button>
                            <button class="btn btn-primary" @click="addSensor(espacio.nombre)">Agregar Sensor</button>
                            <!-- Botones de modificar y eliminar el espacio -->
                            <button class="btn btn-primary" @click="modificarEspacio(espacio.nombre)">Modificar
                                Espacio</button>
                            <button class="btn btn-danger" @click="eliminarEspacio(espacio.nombre)">Eliminar
                                Espacio</button>
                            <!-- Botón para ver el espacio -->
                            <router-link class="btn btn-success " :to="{ name: 'Espacio', params: { id: espacio.id } }">
                                Ver Espacio
                            </router-link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<style>
.esp {
    background-color: var(--bs-info-border-subtle);
    border-radius: 10px;
    padding: 10px;

}

.brand-id {
  font-size: 1rem; /* Tamaño de fuente más pequeño */
  color: #491f1f; 
}

.l {
    display: inline;
    margin-bottom: 1.5em;
    font-size: 0.7em;
}

.l {
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0.75em;
    box-shadow: 0.125em 0.125em 0 0.125em rgba(0, 0, 0, 0.3) inset;
    color: #fdea7b;
    display: inline-flex;
    align-items: center;
    margin: auto;
    padding: 0.15em;
    width: 3em;
    height: 1.5em;
    transition: background-color 0.1s 0.3s ease-out, box-shadow 0.1s 0.3s ease-out;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.l:before,
.l:after {
    content: "";
    display: block;
}

.l:before {
    background-color: #d7d7d7;
    border-radius: 50%;
    width: 1.2em;
    height: 1.2em;
    transition: background-color 0.1s 0.3s ease-out, transform 0.3s ease-out;
    z-index: 1;
}

.l:after {
    background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.15) 0) 0 50% / 50% 100%,
        repeating-linear-gradient(90deg, #bbb 0, #bbb, #bbb 20%, #999 20%, #999 40%) 0 50% / 50% 100%,
        radial-gradient(circle at 50% 50%, #888 25%, transparent 26%);
    background-repeat: no-repeat;
    border: 0.25em solid transparent;
    border-left: 0.4em solid #d8d8d8;
    border-right: 0 solid transparent;
    transition: border-left-color 0.1s 0.3s ease-out, transform 0.3s ease-out;
    transform: translateX(-22.5%);
    transform-origin: 25% 50%;
    width: 1.2em;
    height: 1em;
    box-sizing: border-box;
}

/* Checked */
.l:checked {
    background-color: rgba(0, 0, 0, 0.45);
    box-shadow: 0.125em 0.125em 0 0.125em rgba(0, 0, 0, 0.1) inset;
}

.l:checked:before {
    background-color: currentColor;
    transform: translateX(125%)
}

.l:checked:after {
    border-left-color: currentColor;
    transform: translateX(-2.5%) rotateY(180deg);
}

.l:focus {
    outline: 0;
}
</style>



