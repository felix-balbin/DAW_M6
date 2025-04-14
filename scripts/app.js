import { Excel } from "./Excel.js";

const mapa = new Mapa();
let puntsInteresCurrent=[];
let idCounter = 1;

const dropableObj = document.querySelector(".dropable");
const typeFilter = document.getElementById("typeFilter");
const nameFilter = document.getElementById("nameFilter");
const puntInteresLlista = document.getElementById("puntsInteresLlista");
const totalCount = document.getElementById("totalCount");
const infoPaisCiutat = document.getElementById("infoPaisCiutat");
const orderFilter = document.getElementById("orderFilter");
const botoNetejar = document.getElementById("netejar-llista");

dropableObj.addEventListener("dragover", function(event){
    event.preventDefault();
    dropableObj.classList.add("dragover");
    console.log("dragover");
});

dropableObj.addEventListener("dragleave", function(event) {
    event.preventDefault();
    dropableObj.classList.remove("dragover");
});

dropableObj.addEventListener("drop",function(event){
    event.preventDefault();
    dropableObj.classList.remove("dragover");
    const file = event.dataTransfer.files[0];
    if(file){
        carregarFitxers(file)
        console.log("csv dropped")
    }
});

const filtrarPunts = function(){
    let puntsFiltrats = puntsInteresCurrent;
    const tipusFiltre = typeFilter.value;
    const textFiltre = nameFilter.value.toLowerCase();
    const ordreFiltre = orderFilter.value;

    if(tipusFiltre !== ""){
        puntsFiltrats = puntsFiltrats.filter(function(punt){
            return punt.tipus == tipusFiltre;
        })
    }

    if(textFiltre !== ""){
        puntsFiltrats = puntsFiltrats.filter(function(punt){
            const nomPunt = punt.nom.toLowerCase();
            return nomPunt.includes(textFiltre);
        })
    }

    puntsFiltrats.sort((a,b)=>
        ordreFiltre == "asc"? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)
    );

    mostrarLlista(puntsFiltrats);
    mostrarPuntsMapa(puntsFiltrats)

}

const netejarTot = function() {

    console.log("Borrar todo")
    const confirma = confirm("Estas segur que vols eliminar tota la informació?");

    if(!confirma) return;

    puntsInteresCurrent = [];
    idCounter = 1;
    puntInteresLlista.innerHTML = "<p>No hi ha informació a mostrar</p>";
    totalCount.textContent = "Número total: ";
    mapa.borrarPunt();
    typeFilter.innerHTML = '<option value="">Tots</option>';
    infoPaisCiutat.innerHTML = "";
};

typeFilter.addEventListener("change", filtrarPunts);
nameFilter.addEventListener("input", filtrarPunts);
orderFilter.addEventListener("change", filtrarPunts);
botoNetejar.addEventListener("click", netejarTot);


//CARGAR DADES
const carregarFitxers = function(file){
    if(!file.name.endsWith(FILE_EXTENSION)){
        alert("El fitxer no és csv");
        console.error("El fitxer no és csv");

        return;
    }
    console.log("El fitxer té un format correcte");
    llegirFitxer(file);
    
}

const llegirFitxer = async function(file){
    const lineasValidas = await Excel.readCSV(file);
    carregarDades(lineasValidas);
}


const carregarDades = async function(lineas){
    if(lineas.length==0 || !lineas[0]){
        console.log("CSV buit")
        return;
    }
    const primeraLinea = lineas[0].split(CHAR_CSV);

    // const dades = primera.split(CHAR_CSV);
    const codiPais = primeraLinea[CODI];
    const ciutat = primeraLinea[CIUTAT];

    const infoPais = await Excel.getInfoCountry(codiPais, ciutat);
    mostrarInfoPais(infoPais, ciutat);
    mapa.actualitzarPosInitMapa(infoPais.lat, infoPais.lng);
    crearPuntsInteres(lineas);
};


const crearPuntsInteres = function(lineas){
    console.log("Creant punts d'interès amb dades:", lineas);

    puntsInteresCurrent = [];

    lineas.forEach((lineaCSV) => {
        const dades = lineaCSV.split(CHAR_CSV);
        const tipus=dades[TIPUS].toLowerCase();
        console.log(tipus);
        let punt;

        const lat = parseFloat(dades[LATITUD].replace(',', '.')) || 0;
        const lon = parseFloat(dades[LONGITUD].replace(',', '.')) || 0;
        const puntuacio = parseFloat(dades[PUNTUACIO])

        switch(tipus){
            case "espai":
                console.log("Instància objecte PuntInterés");
                punt = new PuntInteres(dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], tipus, lat, lon, puntuacio);
                break;

            case "museu":
                console.log("Instància objecte Museu");
                punt = new Museu(dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], tipus, lat, lon, puntuacio,
                    dades[HORARIS], dades[PREU], dades[MONEDA], dades[DESCRIPCIO]
                );
                break;

            case "atraccio":
                console.log("Instància objecte Atracció");
                punt = new Atraccio(dades[PAIS], dades[CIUTAT], dades[NOM], dades[DIRECCIO], tipus, lat, lon, puntuacio,
                    dades[HORARIS], dades[PREU], dades[MONEDA]
                );
                break;
                
            default:
                console.error("Tipus no trobat: ", tipus);
                return;
        }
        punt.id=idCounter++;
        puntsInteresCurrent.push(punt);
    });
    console.log("Punts creats: ", puntsInteresCurrent);
    actualizarInterfaz();
};


const eliminarPunt = function(id){
    const confirma = confirm("Estàs segur que vols eliminar el punt d’interès?");

    if(!confirma) return;

    puntsInteresCurrent = puntsInteresCurrent.filter(function(punt){
        return punt.id != id
    })
    actualizarInterfaz();
}

const actualizarInterfaz = function(){
    mostrarLlista();
    mostrarPuntsMapa();
    actualizarFiltre();
    totalCount.textContent = `Número total: ${puntsInteresCurrent.length}`;
}


const mostrarLlista = function(punts = puntsInteresCurrent){
    console.log("Mostrant llista de punts:", punts);

    puntInteresLlista.innerHTML = "";

    if(punts.length == 0){
        puntInteresLlista.innerHTML = "<p>No hi ha informació a mostrar</p>";
        return;
    }

    punts.forEach(function(punt){
        const divPunt = document.createElement("div");
        divPunt.classList.add("punt-item", punt.tipus.toLowerCase());
        const divInfoPunt = document.createElement("div");
        divInfoPunt.className = "divInfoPunt";

        let textContingut = `
            <div class="punt-header">
                <h3>${punt.nom}</h3>
            </div>
            <div class="punt-body">     
        `;

        if (punt.tipus == "espai"){
            textContingut +=`
                    <p>${punt.ciutat} | Tipus: ${punt.tipus}</p>
            `;
        }

        if (punt.tipus == "atraccio"){
            textContingut += `
                    <p>${punt.ciutat} | Tipus: ${punt.tipus} | Horaris: ${punt.horaris} Preu: ${punt.preuIva}</p>
                `;
        }

        if (punt.tipus == "museu"){
            textContingut+= `
                    <p>${punt.ciutat} | Tipus: ${punt.tipus} | Horaris: ${punt.horaris} Preu: ${punt.preuIva}</p>
                    <p>Descripció: ${punt.descripcio}</p>
                `;
        }

        textContingut += `</div>`;

        const botoEliminar = document.createElement("button");
        botoEliminar.textContent = "Eliminar";
        botoEliminar.className = "boto-eliminar";
        botoEliminar.addEventListener("click", function(){
            eliminarPunt(punt.id);
        })

        divInfoPunt.innerHTML = textContingut;

        divPunt.appendChild(divInfoPunt);
        // divPunt.innerHTML = textContingut;
        divPunt.appendChild(botoEliminar);
        puntInteresLlista.appendChild(divPunt);
    })
}

const mostrarPuntsMapa = function(punts = puntsInteresCurrent){
    mapa.borrarPunt();

    punts.forEach(function(punt){
        const contingutPopup = `
            <h3>${punt.nom}</h3>
            <p>${punt.direccio}</p>
            <p>Puntuació: ${punt.puntuacio}/10</p>
        `;
    
        mapa.mostrarPunt(punt.latitud, punt.longitud, contingutPopup);

    });
    if (punts.length > 0) {
        mapa.actualitzarPosInitMapa(punts[0].latitud, punts[0].longitud);

    }
}


const actualizarFiltre = function(){
    const tiposUnicos = new Set();
    // const allTipus = [];
    
    puntsInteresCurrent.forEach(function(punt){
        tiposUnicos.add(punt.tipus);
    });

    typeFilter.innerHTML = '<option value="">Tots</option>';

    //Per cada tipus que hi ha a allTipus
    tiposUnicos.forEach(function(tipus){
        const opcion = document.createElement("option");
        opcion.value = tipus;
        opcion.textContent = tipus.charAt(0).toUpperCase() + tipus.slice(1);
        typeFilter.appendChild(opcion);
    });
}

const mostrarInfoPais = (infoPais, ciutat) => {
    infoPaisCiutat.innerHTML = `
        <div class="info-pais">
            <div class="paisBandera">
                <p class="nomPais">${infoPais.nom}</p>
                <div class="banderaImg">
                    (<img src="${infoPais.bandera}" class="bandera">)
                </div>
            </div>
            <p class="ciutat">${ciutat}</p>
        </div>

    `;
};
