let intents=10;
let paraulaSecreta="";
let puntos=0;
let numImagen=0;
let numPartides=0;
let guanyades=0;
let mejorPuntuacion=0;
let fechaHoraMejor="";
let encertadaConsecutiva=0;
let mostrarParaula=[];
let letrasCorrectasPuestas=[];

let visionOjo=document.getElementById("botonOjo");
let verTexto=document.getElementById("paraulaIntent");

const IntentosMostrar=document.getElementById("intentos");
const puntosMostrar=document.getElementById("puntos");
const paraulaJugar=document.getElementById("paraulaJoc");
const totalPartides=document.getElementById("numPartides");
const totalGuanyades=document.getElementById("numGanadas");
const millorJoc=document.getElementById("dataMejorPartida");

function mostrar(){
    if(verTexto.type==="password"){
        verTexto.type="text";
        visionOjo.textContent="visibility_off";
    }else{
        verTexto.type="password";
        visionOjo.textContent="visibility";
    }
}


function isNumber(valor){
    return !isNaN(valor)&&valor.trim()!=="";
}

function comprueba(){
    let entrada=document.getElementById("paraulaIntent").value.trim();

    if(entrada===""){
        alert("Has d'afegir una paraula per poder començar a jugar");
        return;
    }

    if(entrada.length<4){
        alert("La paraula ha de contenir més de 3 caràcters");
        return;
    }

    for(let i=0;i<entrada.length;i++){
        if(isNumber(entrada[i])){
            alert("No numeros");
            return;
        }
    }
    for(let i=0;i<entrada.length;i++){
        if(entrada[i]==" "){
            alert("No espais, nomes una paraula");
            return;
        }
    }

    iniciaJoc(entrada.toLowerCase());

}
function iniciaJoc(paraula){
    //modificar l'aspecte de l'ull
    verTexto.type="password";
    visionOjo.textContent="visibility";
    visionOjo.disabled=true;
    verTexto.disabled=true; 
    
    //deshabilitar boto començar partida
    document.getElementById("comienza").disabled=true;

    //establir i crear _ per cada lletra de la paraula
    paraulaSecreta=paraula;
    mostrarParaula=Array(paraulaSecreta.length).fill("_");
    paraulaJugar.textContent=mostrarParaula.join(" ");
    intents=10;
    puntos=0;
    numImagen=0;

    //habilito les lletres
    const botones=document.getElementById("botones").children;
    for(let i=0;i<botones.length;i++){
        botones[i].disabled=false;
    }
}


function crearLetras(){
    const botones=document.getElementById("botones");
    const abecedario='abcdefghijklmnopqrstuvwxzy';
    botones.innerHTML="";

    for(let i=0;i<abecedario.length;i++){
        const letra=document.createElement("button");
        letra.textContent=abecedario[i].toUpperCase();
        letra.disabled=true;
        letra.onclick=function(){
            verificarLetra(abecedario[i]);
        }
        botones.appendChild(letra);
    }
}


function verificarLetra(letraEntrada){
    let correcta=false;


    if(letrasCorrectasPuestas.includes(letraEntrada)){
        alert('Ya has acertado esa letra');
            return; 
    }

    let vecesAparece=0;

    for(let i=0;i<paraulaSecreta.length;i++){
        if(paraulaSecreta[i]===letraEntrada){
            mostrarParaula[i]=letraEntrada;
            correcta=true;
            vecesAparece++;
        }
    }

    if(correcta){
        letrasCorrectasPuestas.push(letraEntrada);
        puntos=(puntos+encertadaConsecutiva)*vecesAparece;
        encertadaConsecutiva++;
        dadesActualizat();            
        
        
    }else{
        intents--;
        encertadaConsecutiva=0;
        if(puntos>0){
            puntos--; //baixa punts per error, pero no baixa de 0
        }
        numImagen++;
        dadesActualizat();
        cambiarImagen();
    }

    paraulaJugar.textContent=mostrarParaula.join(" ");

    dadesActualizat();

    //estableixo 1 segon d'espera per executar ganarPerder
    setTimeout(ganarPerder,1000);
}

let partidaTerminada=false;
function ganarPerder(){
    if(intents===0){
        if(!partidaTerminada){
            alert("Perdiste");
            numPartides++;
            partidaTerminada=true;
            dadesActualizat();
            document.getElementById("botonNova").disabled=false;
            mejorPartidaFinalizada();
        }
    }else if(mostrarParaula.join('')===paraulaSecreta){
        if(!partidaTerminada){
            alert("Ganaste");
            guanyades++;
            numPartides++;
            dadesActualizat();
            document.getElementById("botonNova").disabled=false;
            mejorPartidaFinalizada();
        }
    }
}

function mejorPartidaFinalizada(){
    if(puntos>mejorPuntuacion){
        mejorPuntuacion=puntos
        let f=new Date();
        fechaHoraMejor=(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()+ " | Hora:"+f.getHours()+":"+f.getMinutes());

        millorJoc.textContent=`Data: ${fechaHoraMejor} | Punts: ${mejorPuntuacion}`;
    }
}

function cambiarImagen(){
    document.getElementById("colgado").src=`./penjat-dibuixos/penjat_${numImagen}.jpg`;
}

function dadesActualizat(){
    IntentosMostrar.textContent=`Intents restants: ${intents}`;
    puntosMostrar.textContent = `Punts: ${puntos}`;
    totalPartides.textContent=`Total partides: ${numPartides}`;
    totalGuanyades.textContent=`Total partides guanyades: ${guanyades}`;

    //millorJoc=document.getElementById("dataMejorPartida");


}

function reiniciar(){
    intents=10;
    paraulaSecreta="";
    puntos=0;
    numImagen=0;
    visionOjo.disabled=false;
    verTexto.disabled=false; 
    document.getElementById("comienza").disabled=false;
    document.getElementById("botonNova").disabled=true;

    encertadaConsecutiva=0;
    mostrarParaula=[];
    letrasCorrectasPuestas=[];
    dadesActualizat();
    cambiarImagen();


}
crearLetras();
document.getElementById("botonNova").disabled=true;

/*
function estatJoc(){
    if(intents===0){
        alert("Perdiste");
    }else if(mostrarParaula.join('')===paraulaSecreta){
        alert("Ganaste");
    }
}*/