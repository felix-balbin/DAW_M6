import { CLIENT_ID, CLIENT_SECRET } from './dades_client.js';

// para corregir
// const CLIENT_ID = "";
// const CLIENT_SECRET = "";

console.log(CLIENT_ID, CLIENT_SECRET)

const botoBuscar = document.getElementById("botoBusca");
const botoBorrar = document.getElementById("botoBorra");
const barraBuscar = document.getElementById("barraBusqueda");
const allResults = document.getElementById("todos-resultados");
const infoArtista = document.getElementById("info-artista");
const infoResultats = document.getElementById("info-resultats");
const divTopTracks = document.getElementById("top-tracks");

let nCancionsTotal = 0;
let nCancionsActuals = 0;
let offset = 0;
 
let accessToken = '';

// Función para obtener el token de acceso de Spotify
const getSpotifyAccessToken = function(CLIENT_ID, CLIENT_SECRET) {
    const URL = "https://accounts.spotify.com/api/token";
    const CREDENCIALS = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    const header = {
        Authorization: `Basic ${CREDENCIALS}`,
        "Content-Type": "application/x-www-form-urlencoded",
    };

    const body = "grant_type=client_credentials";

    return fetch(URL, {
        method: "POST",
        headers: header,
        body: body,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then((data) => {
        accessToken = data.access_token;
        console.log("Access token:", accessToken);
        enableButtons();
        return accessToken;
    })
    .catch((error) => {
        console.error("Error al obtenir el token:", error);
    });
};

// Función para habilitar los botones
const enableButtons = function() {
    if (botoBuscar.disabled) botoBuscar.disabled = false;
    if (botoBorrar.disabled) botoBorrar.disabled = false;  
};

// Función para buscar canciones en Spotify
const searchSpotifyTracks = function(query, accessToken) {
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                        query
                      )}&type=track&limit=12&offset=${offset}`;

    fetch(searchUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ( ${response.statusText} )`);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.tracks.items.length > 0) {
          infoResultats.innerHTML = "";
          nCancionsActuals += data.tracks.items.length;
          console.log(nCancionsActuals);
          nCancionsTotal = data.tracks.total;

          for(let i = 0;i < data.tracks.items.length; i++){

              const track = data.tracks.items[i];

              const cancionDiv = document.createElement("div");
              cancionDiv.classList.add("track-result");

              const divPortada = document.createElement("div");
              divPortada.classList.add("portada");

              const imgPortada = document.createElement("img");
              imgPortada.src = track.album.images[0]?.url;
              imgPortada.alt = track.name;
              divPortada.appendChild(imgPortada);
              cancionDiv.appendChild(divPortada);

              // Nombre de la canción
              const nombreCancion = document.createElement("p");
              nombreCancion.textContent = track.name;
              cancionDiv.appendChild(nombreCancion);

              const nombreArtista = document.createElement("p");
              nombreArtista.textContent = `Artista: ${track.artists[0].name}`;
              cancionDiv.appendChild(nombreArtista);

              const albumCancion = document.createElement("p");
              albumCancion.textContent = `Album: ${track.album.name}`;
              cancionDiv.appendChild(albumCancion);

              const botoAfegir = document.createElement("button");
              botoAfegir.classList.add("boto-afegir");
              botoAfegir.textContent = "+ Afegir cançó";
              cancionDiv.appendChild(botoAfegir);

              //creaR los resultados
              allResults.appendChild(cancionDiv);



              //mostrar info del artista cuando se clica en una cancion
              cancionDiv.addEventListener("click", function(){
                const idArtista = track.artists[0].id;
                // cancionDiv.classList.toggle("seleccionado");
                getArtistInfo(idArtista, accessToken);
              });


              //añadir id de cancion a localstorage
              botoAfegir.addEventListener("click", function(){
                //JSON.parse sirve para volver una cadena string de JSON a key:value (objeto JavaScript)
                let listaIdCancionesAnterior = localStorage.getItem("cancionsAfegides");
                console.log(listaIdCancionesAnterior)
                let listaIdCanciones;

                if(listaIdCancionesAnterior){
                    //Uso JSON.parse para pasar la cadena texto JSON (como devuelve los datos localstorage)
                    listaIdCanciones = JSON.parse(listaIdCancionesAnterior);
                }else{
                    listaIdCanciones = [];
                }

                let idCancion = track.id
                // si quisiera añadir el id y el nombre:
                // let nombreCancionAfegir = track.name;

                //JSON.stringify sirve para convertir un objeto JavaScript/valor en un string en formato JSON
                //localstorage solo guarda strings, devuelve string JSON
                if(!listaIdCanciones.includes(idCancion)){
                    listaIdCanciones.push(idCancion)
                    // si quisiera añadir el id y el nombre:
                    /*listaIdCanciones.push({
                        id: idCancion,
                        titulo: nombreCancionAfegir
                    });*/
                    localStorage.setItem("cancionsAfegides", JSON.stringify(listaIdCanciones));
                }else{
                    // alert("Cancion ya añadida");
                }
              });

              cargarMasResultados();

          }
      } else{
        document.getElementById("info-resultats").innerHTML="No hi han resultats";
      }
    })

    .catch((error) => {
        console.error("Error al buscar cançons:", error);
    });
};

// Función para obtener información del artista
const getArtistInfo = function(artistId, accessToken) {
    const artistUrl = `https://api.spotify.com/v1/artists/${artistId}`;

    fetch(artistUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("Artist Info:", data);
        // const infoArtista = document.getElementById("info-artista");

        infoArtista.innerHTML = "";

        const divImgArtista = document.createElement("div");
        divImgArtista.classList.add("imgArtista"); 

        // imatge artista info
        const imgArtista = document.createElement("img");
        imgArtista.src = data.images[0]?.url;
        imgArtista.alt = data.name;
        divImgArtista.appendChild(imgArtista);
        infoArtista.appendChild(divImgArtista);


        const nombreArtista = document.createElement("p");
        nombreArtista.classList.add("nomArtista");
        nombreArtista.textContent = data.name;
        infoArtista.appendChild(nombreArtista);

        const popularitat = document.createElement("p");
        popularitat.textContent = `Popularitat: ${data.popularity}`;
        infoArtista.appendChild(popularitat);

        const generes = document.createElement("p");
        generes.textContent = `Gèneres: ${data.genres}`;
        infoArtista.appendChild(generes);

        const seguidors = document.createElement("p");
        seguidors.textContent = `Seguidors: ${data.followers.total}`;
        infoArtista.appendChild(seguidors);

        getTopTracks(artistId, accessToken);


    })
    .catch((error) => {
        console.error("Error al obtenir l'info del artista:", error);
    });
};

// Funcion para devolver los top tracks del artista
const getTopTracks = function (artistId, accessToken) {
  const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks`;

  fetch(topTracksUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    if(!response.ok){
      throw new Error(`Error: ${response.status} ( ${response.statusText} )`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Top canciones: ", data);

    // const divTopTracks = document.getElementById("top-tracks");
    divTopTracks.innerHTML = "";

    const topTracks = data.tracks.slice(0, 3);

    const listaOrdenada = document.createElement("ol");
    for(let i = 0; i < topTracks.length; i++){
        const track = topTracks[i];
        const listaItem = document.createElement("li");

        const nombreCancion = document.createElement("p");
        nombreCancion.textContent = track.name;
  
        listaItem.appendChild(nombreCancion);
        listaOrdenada.appendChild(listaItem);
    }

    divTopTracks.appendChild(listaOrdenada);
  })
  .catch((error) => {
    console.error("Error per retornar els top tracks", error);
  });
}

// Boton cargar mas resultados
const cargarMasResultados = function() {
    if (!document.getElementById("boto-cargar-mes") && nCancionsActuals < nCancionsTotal) {
        const divBoton = document.createElement("div");
        divBoton.classList.add("botonDiv");

        const botoCargarMes = document.createElement("button");
        botoCargarMes.id = "boto-cargar-mes";
        botoCargarMes.classList.add("botonMas");

        botoCargarMes.textContent = `+ cançons (${nCancionsActuals} de ${nCancionsTotal})`;

        divBoton.appendChild(botoCargarMes);


        
        botoCargarMes.addEventListener("click", function() {
            if (nCancionsActuals<nCancionsTotal-11){
                offset += 12;
                nCancionsActuals += 12;
                searchSpotifyTracks(barraBuscar.value, accessToken);
                botoCargarMes.textContent = `+ cançons (${nCancionsActuals} de ${nCancionsTotal})`;    
            }else{
                offset = nCancionsTotal;
                nCancionsActuals = nCancionsTotal;
                searchSpotifyTracks(barraBuscar.value, accessToken);
                botoCargarMes.textContent = `+ cançons (${nCancionsActuals} de ${nCancionsTotal})`;    
            }
        });

        document.getElementById("dades-pantalla").appendChild(divBoton);

        // document.getElementById("dades-pantalla").appendChild(botoCargarMes);
    }
};


// Buscador
barraBuscar.addEventListener("input", function() {
    const query = barraBuscar.value;
    // si no hay rexto, deshabilitada. Si hay texto, se habilita
    botoBuscar.disabled = query.trim() === "";


    
});

// boton buscar
botoBuscar.addEventListener("click", function() {
    const query = barraBuscar.value;
    if (barraBuscar.value.trim() === "") {
      alert("Has d'introduir el nom d'una cançó");
      return;
    }  

    allResults.innerHTML = "";

    getSpotifyAccessToken(CLIENT_ID, CLIENT_SECRET)
    .then((token) => {
        searchSpotifyTracks(query, token);
    })
    .catch((error) => {
        console.error("No se pudo obtener el token:", error);
    });
});

// boton borrar
botoBorrar.addEventListener("click", function(){
  barraBuscar.value = "";
  allResults.innerHTML = "";
  infoArtista.innerHTML = "Informació artista";
  infoResultats.innerHTML = "Fes una nova búsqueda";
  divTopTracks.innerHTML = "";
  document.getElementById("info-cancons").innerHTML = "Informació cançons";

  if(document.getElementById("boto-cargar-mes")){
    document.getElementById("boto-cargar-mes").remove();
  }

  document.getElementById("info-resultats").textContent  = "Fes una nova búsqueda";
});


//Reiniciar lista de canciones añadidas cuando reinicias la web
window.onload = function(){
    // localStorage.clear();
    localStorage.removeItem("cancionsAfegides");
}