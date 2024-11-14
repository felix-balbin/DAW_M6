//DECLARAR OBJECTES
//const -> sempre mateix objecte
//let -> varia objecte
//Javascript es un llenguatje no tipas

const btnIns = document.getElementById("btn-instruccions");
const nomJug = document.getElementById("nom");
const todasCartas = document.getElementById("todas-cartas");
const letras = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J'];
const cartaClick = document.querySelectorAll(".flip-card");
const puntsAct = document.getElementById("punts-actuals");
const dadesMillorJoc = document.getElementById("dadesMillorJoc");

const canalBroadcast = new BroadcastChannel("canal");

//DECLARAR EVENTS
btnIns.addEventListener("click",mostraInstruccions);

/*
YA ESTA PUESTO AL CREAR LAS CARTAS
for (let i=0; i< cartaClick.length; i++){
    cartaClick[i].addEventListener("click", giraCarta);
}*/

//DECLARAR VARIANTS I CONSTANTS
let finestra;
let nomJugActual ="";
let nomMillorJoc;
let valorCarta1 = null;
let valorCarta2 = null;
let primeraCarta = null;
let segonaCarta = null;
let puntos = 0;
let comparando = false; 
let parellesTrobades = 0;

const color = colorNavegador();
const NUM_PARELLES = 10;
//const maxPunts = localStorage.getItem("millorPuntuacio");
//const nomJugador = localStorage.getItem("millorJugador");


//FUNCIONALITAT
function mostraInstruccions(){
    finestra=window.open("./instruccions.html","instruccions","width=400,height=400");
}

//MOSTRA PER PANTALLA EL NOM DEL USUARI
function mostraGaleta(){
    let nomCookie = document.cookie.split("=");
    console.log(nomCookie);
    nomJug.textContent = `Jugador: ${nomCookie[1]}`;   
    nomJugActual=nomCookie[1]; 
}

//MOSTRA PER PANTALLA ELS PUNTS
function mostraPuntsActuals(){
    puntsAct.textContent = `Punts: ${puntos}`;    
}

//BROADCAST CHANNEL
/*canalBroadcast.onmessage = (eventMessage) => {
    console.log("hola soy broadcast");
}*/

//ENVIAR DATOS

/*
==================
COLOR DE FONDO
==================
*/

function colorNavegador(){
    const navegador = navigator.userAgent;
    /*
    uso el navegador.indexOf("nom") !== -1 perque indexOf 
    retorna -1 quan no troba l'indicat a la cadena. 
    M'asseguro de que ha trobat la paraula.
    */
    if (navegador.indexOf("Firefox") !== -1){
        return "#FDB44B";
    }else if(navegador.indexOf("Chrome") !== -1){
        return "#ACE1AF";
    }
}

function coloreaPagina(){
    //color = colorNavegador();
    document.body.style.backgroundColor = color;
    sessionStorage.setItem("colorPagina", color);
}

/*
------
-
--
-
CREA CARTAS
-
-
-
------
*/

function mezclaCartas(letras){
    for(let i = letras.length -1; i > 0; i--){
        let aleatorio = Math.floor(Math.random()*(i + 1));
        

        //Cambia la posicion de i por aleatorio, y la de aleatorio por i
        [letras[i], letras[aleatorio]] = [letras[aleatorio], letras[i]];
    }
    return letras;
}

function creaCartas(){
    const letrasMezcladas = mezclaCartas(letras);

    for (let i=0; i < letrasMezcladas.length; i++){
        const flipCard = document.createElement("div");
        flipCard.classList.add("flip-card");

        //Creo la parte de dentro de cada div, lo que contendrá las caras de la carta
        const flipCardDentro = document.createElement("div");
        flipCardDentro.classList.add("flip-card-dentro");
        
        //Cara exterior/frente
        const flipCardFrente = document.createElement("div");
        flipCardFrente.classList.add("flip-card-frente");

        //Cara interior/atras
        const flipCardAtras = document.createElement("div");
        flipCardAtras.classList.add("flip-card-atras"); 
        flipCardAtras.textContent = letrasMezcladas[i]; //asigna una letra a cada carta en orden

        //Crea las caras de la carta
        flipCardDentro.appendChild(flipCardFrente);
        flipCardDentro.appendChild(flipCardAtras);

        //Añade la parte de dentro del div al div
        flipCard.appendChild(flipCardDentro);

        //añade la carta al contenedor de cartas
        todasCartas.appendChild(flipCard);

        //Añado addEventListener para que se aplique a cada carta tras ser creada
        flipCard.addEventListener("click", giraCarta)
    }
}

/*
------
-
--
-
GIRAR CARTAS
-
-
-
------
*/


function giraCarta() {
    //Escojo el flip.card.dentro del flip-card y añado o quito(toggle)
    // y la clase flipped, que activa el css que gira el div
    if(comparando) return;

    const giraCartaDiv = this.querySelector('.flip-card-dentro');
    giraCartaDiv.classList.add('flipped');

    //Si la carta contiene correcta, no permite elegirla
    if (giraCartaDiv.classList.contains("correcta")){
        alert("Esa carta ya está acertada. Escoge otra");
        return;
    }


    if (valorCarta1 == null){
        primeraCarta = giraCartaDiv; //Si todas estan del reves, guardo la primera carta girada y su contenido
        valorCarta1 = this.querySelector('.flip-card-atras').textContent;
    }else{
        //Si ya hay una carta girada, guardo la segunda
        segonaCarta = giraCartaDiv;
        if(segonaCarta == primeraCarta){
            segonaCarta = null;
            alert("Selecciona otra carta");
        }else{
            valorCarta2 = this.querySelector('.flip-card-atras').textContent;

        }
    }

    if(valorCarta1!==null && valorCarta2!==null){
        comparando = true;
        //Lo detengo un tiempo para que compare y no se puedan girar más de esas 2 cartas
        setTimeout(esParoNo, 500)

    }

}

/*
===========================
COMPRUEBA PAR Y PUNTUACION
===========================
*/
  
function esParoNo(){
    if(valorCarta1 == valorCarta2){
        puntos+=10;
        parellesTrobades++;
        console.log("Puntos: " + puntos);
        //canalBroadcast.postMessage({ tipo: 'puntuacio', puntos: puntos });
    
        primeraCarta.style.pointerEvents = "none";
        segonaCarta.style.pointerEvents = "none";
    
        primeraCarta.classList.remove("flipped");
        segonaCarta.classList.remove("flipped");
        
        primeraCarta.classList.add("correcta");
        segonaCarta.classList.add("correcta");
        
                
    }else{
        if(puntos>2){
            puntos-=3;
        }else if(puntos==2){
            puntos=0;
        }else if(puntos==1){
            puntos=0;
        }
        console.log("Puntos: " + puntos);

        primeraCarta.classList.remove("flipped");
        segonaCarta.classList.remove("flipped");
    }

    valorCarta1 = null;
    valorCarta2 = null;
    primeraCarta = null;
    segonaCarta = null;

    comparando = false;

    //Actualitzo la mostar per pantalla dels punts
    mostraPuntsActuals();
    carregarDades();
    finalPartida();
}





function carregarDades(){
    //console.log(canalBroadcast)
    
    
    //Envio les dades de la partida actual a index
    canalBroadcast.postMessage({"jugador" : nomJugActual, "punts" : puntos});
    
    //Si millorPuntuacio existe y te un valor, obtiene ese valor. Si no, lo indica como 0
    const maxPunts = Number(localStorage.getItem("millorPuntuacio") || 0);
    const nomJugador = localStorage.getItem("millorJugador") || "jugador";

    if (maxPunts > 0) {
        dadesMillorJoc.textContent = `JUGADOR: ${nomJugador} - PUNTS: ${maxPunts}`;
    } else {
        dadesMillorJoc.textContent = "No hi ha cap record encara";
    }
}

function finalPartida(){
    if(parellesTrobades == NUM_PARELLES){
        console.log("Partida finalitzada")
        sessionStorage.removeItem("partidaComencada");
        
        const maxPunts = Number(localStorage.getItem("millorPuntuacio") || 0);
        const nomJugador = localStorage.getItem("millorJugador") || "jugador";

        if(puntos > maxPunts){
            localStorage.setItem("millorPuntuacio", puntos);
            localStorage.setItem("millorJugador", nomJugActual);

            console.log(`Record superat! Millor puntuacio: ${puntos} per ${nomJugActual}`);
        }else{
            console.log(`No has superat el record. Puntuació: ${puntos}`)
        }
        dadesMillorJoc.textContent=`JUGADOR: ${localStorage.getItem("millorJugador")} — PUNTS: ${localStorage.getItem("millorPuntuacio")}`;

        carregarDades();

        setTimeout(function(){
            window.location.assign("./partidaFinalitzada.html");
        }, 3000);
    }
}

//Llamadas
creaCartas();
mostraGaleta();
coloreaPagina();
mostraPuntsActuals();
carregarDades();


//Des-comentar y guardar para reiniciar el registro de mejor puntuacion
//Volver a comentar una vez hecho
//localStorage.setItem("millorPuntuacio", puntos);
//localStorage.setItem("millorJugador", nomJugActual);