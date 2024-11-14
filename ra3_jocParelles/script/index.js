//DECLARAR OBJECTES
//const -> sempre mateix objecte
//let -> varia objecte
//Javascript es un llenguatje no tipas


//DECLARAR VARIANTS I CONSTANTS
let finestra;

const btnPartida=document.getElementById("btn-partida");
const btnBorrar=document.getElementById("btn-borrar");
const nomJugadorObj=document.getElementById("nom-jugador");
const infoNavegadorObj=document.getElementById("info-navegador");
const infoUrlObj=document.getElementById("info-url");

const canalBroadcast = new BroadcastChannel("canal");
const dadesPartidaAct = document.getElementById("infoPartidaIndex");



//DECLARAR EVENTS
btnPartida.addEventListener("click",començarPartida);
btnBorrar.addEventListener("click",borrarPartida);


//FUNCIONALITAT

function començarPartida(){
    if(nomJugadorObj.value){
        //console.log("Començar partida");
        //redirecciona:  location.assign("index.html");
        document.cookie= "NomJugador=" + nomJugadorObj.value;
        localStorage.setItem("nom", nomJugadorObj.value);
        
        //Comprobar estat de la finestra
        if(finestra && !finestra.closed){
            //finestra=window.open("./joc.html","joc","width=450,height=1000");
            finestra.focus();
            alert("Ja hi ha una partida començada");
            finestra.close();
        }else{
            finestra=window.open("./joc.html","joc","width=450,height=1000");
            sessionStorage.setItem("partidaComencada", "true");
        }

    }else{
        alert("Has d'introduir el nom del jugador");
    }


}

function borrarPartida(){
    //Si existe finestra y no ha sido cerrada antes
    //Especifico !finestra.closed porque si cierras manualmente finestra sigue con un valor y da errores
    if (finestra && !finestra.closed){
        finestra.close();
        finestra = null;
    }else{
        alert("No hi ha cap finestra");
    }
}

function infoNavegador(){
    const usrAgent=navigator.userAgent;
    infoNavegadorObj.textContent=usrAgent;
}

function infoURL(){
    const url=location.origin;
    console.log("pathname",location.pathname);
    console.log("host",location.host);
    console.log("href",location.href);
    infoUrlObj.textContent=`${location.href}`;

}

//BROADCAST CHANNEL
canalBroadcast.onmessage = (event) => {
    console.log(event);
    document.getElementById("infoPartidaIndex").textContent = "Jugador: " + event.data.jugador + " - Puntuació: "+ event.data.punts;
}


//LAMADAS
infoNavegador();
infoURL();