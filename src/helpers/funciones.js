import Swal from "sweetalert2";

export const estadoEjecutor = (estado) => (estado ? "Encendido" : "Apagado");

export const mostrarError = (title, text) => {
    Swal.fire({
        icon: "error",
        title,
        text,
    });
};
