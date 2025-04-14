export class Excel {
    static async readCSV(file) {
        return new Promise((ok, nok) => {
            if (!file.name.endsWith(".csv")) {
                nok(new Error("El fitxer no és CSV"));
                console.error("El fitxer no és csv");
                return;
            }
            console.log("El fitxer té un format correcte");

            const fileReader = new FileReader();

            fileReader.onload = function(event){
                //Con slice(1) me salto la capçelera
                const lineasValidas = event.target.result.split("\n").slice(1).filter(line => line.trim() !== "");
        
                if (lineasValidas.length==0) return;
        
                ok(lineasValidas);
        
            };
        
            fileReader.onerror = function(){
                console.log("Error al llegir el fitxer");
                alert("Error al llegir el fitxer");
                nok(new Error("Error al llegir el fitxer"))
            }
            fileReader.readAsText(file);
        });
    }

    static async getInfoCountry(codiPais, ciutat) {
        return fetch(`https://restcountries.com/v3.1/alpha/${codiPais}`)
        .then(function(resposta) {
            if (!resposta.ok){
                throw new Error("Error API");
            }
            return resposta.json();
        })
        .then(function(data) {
            const pais = data[0];
            return {
                bandera: pais.flags?.png,
                lat: pais.latlng?.[0],
                lng: pais.latlng?.[1],
                nom: pais.name?.common,
                ciutat: ciutat
            };
        })
        .catch(function(error) {
            console.error("Error obtenint info país:", error);
            return {};
        });
    }
}
