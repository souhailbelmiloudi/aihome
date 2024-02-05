export  const generarIdSimple = ()=> {
    const letras = generarLetrasSimple(2);
    const numeros = generarNumerosSimple(3);
    return letras + numeros;
}

const  generarLetrasSimple=(cantidad)=> {
    let result = '';
    const letrasPosibles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < cantidad; i++) {
        result += letrasPosibles.charAt(Math.floor(Math.random() * letrasPosibles.length));
    }
    return result;
}

const  generarNumerosSimple=(cantidad) =>{
    let result = '';
    for (let i = 0; i < cantidad; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}


