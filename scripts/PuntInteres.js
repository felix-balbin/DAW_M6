// class puntinteres{
//     this.sdd
//     es pare
// }

// class Atraccio extends puntinteres{

// }

// class Museu extends puntinteres{
//     horaris;
//     preu;
//     descripcio;
//     constructor(id, pais, ciutat, nom, direccio, latitud,...)
// }

const IVA_PAIS = {
    Espanya: 0.21,
    Alemania: 0.19, //esto es UK en ISO
    Belgica: 0.21
}

class PuntInteres {
    static totalElements = 0;
    static idNum = 0;
    #id;
    #esManual;
    //si es privado y quiero acceder a el, tenog que usar el # delante

    constructor(pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, esManual = false) {
        this.#id=PuntInteres.idNum++;
        this.#esManual = esManual;
        this.pais = pais;
        this.ciutat = ciutat;
        this.nom = nom;
        this. direccio = direccio;
        this.tipus = tipus;
        this.latitud = latitud;
        this.longitud = longitud;
        this.puntuacio = puntuacio;

        PuntInteres.totalElements++;
    }

    set id(valor) {
        this.#id = valor;
    }
    
    get id(){
        return this.#id;
    }
    get esManual(){
        return this.#esManual;
    }
    set esManual(valor){
        this.#esManual = valor;
    }
    static obtenirTotalElements(){
        return this.totalElements;
    }
}

class Atraccio extends PuntInteres {
    constructor(pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, horaris, preu, moneda) {
        super(pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio);
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
    }

    get preuIva(){
        const iva = IVA_PAIS[this.pais];
        const preu = this.preu;
        if(preu == 0){
            return "Entrada gratuita";
        }
        if(iva){
            const preuIva = this.preu * (1 + iva /100);
            return `${preuIva.toFixed(2)}${this.moneda} (IVA)`;
        }else{
            return `${preu}${this.moneda} (no IVA)`;
        }
    }  
}

class Museu extends PuntInteres {
    constructor(pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, horaris, preu, moneda, descripcio) {
        super(pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio);
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
        this.descripcio = descripcio;
    }

    get preuIva(){
        const iva = IVA_PAIS[this.pais];
        const preu = this.preu;
        if(preu == 0){
            return "Entrada gratuita";
        }
        if(iva){
            const preuIva = this.preu * (1 + iva /100);
            return `${preuIva.toFixed(2)}${this.moneda} (IVA)`;
        }else{
            return `${preu}${this.moneda} (no IVA)`;
        }
    }  

}