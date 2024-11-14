//DECLARAR OBJECTES
//const -> sempre mateix objecte
//let -> varia objecte
//Javascript es un llenguatje no tipas

const btnCerrar=document.getElementById("btn-cerrar");

//DECLARAR EVENTS
btnCerrar.addEventListener("click",cerrarFinestra);

//DECLARAR VARIANTS I CONSTANTS
let finestra;

//FUNCIONALITAT
function cerrarFinestra(){
    window.close()
}