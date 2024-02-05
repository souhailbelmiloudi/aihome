<script setup>
import { ref } from 'vue'



const datosUser = ref(null)
const obtenerDatosUsuario = () => {
    datosUser.value = JSON.parse(localStorage.getItem('user'))
}

obtenerDatosUsuario()
</script>

<template>
    <div class="container">
        <h1 class="text-center mt-5">
            Perfil de Usuario
        </h1>
        <div class="container mt-5">

            <div class="row">
                <div class="col-8 offset-md-2">
                    
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                            tabindex="0">
                            <div class="row mt-3">
                                <div class="col-4">
                                    <img src="@/assets/img/perfil.svg" alt="" class="img-thumbnail">
                     
                                </div>
                                <div class="col-8">
                                    <div class="form-group row mb-3">
                                        <label for="nombre" >Nombre:</label>
                                        <input type="text" class="form-control" id="nombre" :placeholder="datosUser.name" readonly > 
                                    </div>
                                    <div class="form-group row mb-3">
                                        <label for="salas" >salas:</label>
                                        <input type="text" class="form-control" id="salas" :placeholder="datosUser.espacios.length" readonly> 
                                    </div>
                                    <div class="form-group row mb-3">
                                        <label for="email" >Email:</label>
                                        <input type="text" class="form-control" id="email" :placeholder="datosUser.email" readonly>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>

                    </div>
                       
                </div>
            </div>

        </div>






    </div>
</template>


<style lang="scss" scoped></style>