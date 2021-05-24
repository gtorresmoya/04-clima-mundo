const fs = require('fs')
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json'
    constructor() {
        this.leerDB()
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        });
    }

    get paramsMapBox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        } catch (error) {
            return [];
        }
    }

    async clima(lat = 0, lon = 0){
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsOpenWeather, lat, lon}
            })
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                temperatura : main.temp,
                maxima: main.temp_max,
                minima: main.temp_min
            }
        } catch (error) {
            console.log('Error: ', error)
            return null;
        }
    }

    async agregarHistoria(lugar = ''){
        if(this.historial.includes(lugar.toLowerCase())){
            return
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar);
        this.guardarDB()
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath))
            return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8'})
        this.historial = (JSON.parse(info)).historial;
    }
}

module.exports = Busquedas;