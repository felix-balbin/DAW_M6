class Mapa {
    #map;
    #markers = [];
    #userMarker = null;

    constructor() {
        const mapCenter = [41.3851, 2.1734];
        const zoomLevel = 13;

        this.#map = L.map('map').setView(mapCenter, zoomLevel);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.#map);

        this.#getPosicioActual();
    }
    
    #getPosicioActual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                this.mostrarPuntInicial(lat, lng);
            }, (error) => {
                console.error("Error en la geolocalització:", error);
            }, { maximumAge: 60000 });
        } else {
            console.error("La geolocalització no està disponible en aquest navegador.");
        }
    }

    mostrarPuntInicial(lat, lng){
        if (this.#userMarker) this.#map.removeLayer(this.#userMarker);

        this.#userMarker = L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup("Estàs aquí")
            .openPopup();

        this.actualitzarPosInitMapa(lat, lng);
    }

    actualitzarPosInitMapa(lat, lon){
        this.#map.setView([lat, lon], 13);
    }

    mostrarPunt(lat, long, desc = ""){
        const marker = L.marker([lat, long])
            .bindPopup(desc)
            .addTo(this.#map);
        this.#markers.push(marker);
    }

    borrarPunt(){
        this.#markers.forEach(marker => this.#map.removeLayer(marker));
        this.#markers = [];
    }
}
