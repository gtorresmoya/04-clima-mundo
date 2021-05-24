require('dotenv').config();

const { leerInput, inquirerMenu, pausaMenu, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async () => {
    let opt;
    const search = new Busquedas();
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje para que escriba
                const busqueda = await leerInput('Ciudad: ');
                //Buscar los Lugares
                const lugares = await search.ciudad(busqueda);
                //Seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if( idSeleccionado === '0')
                    continue
                //Mostrar Clima en base a el lugar seleccionado
                //Mostrar resultados
                const lugarSel = lugares.find( l => l.id === idSeleccionado);
                await search.agregarHistoria(lugarSel.nombre)

                const clima = await search.clima(lugarSel.lat, lugarSel.lng)

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad\t\t:', lugarSel.nombre.green);
                console.log('Latitud\t\t:', lugarSel.lat);
                console.log('Longitud\t:', lugarSel.lng);
                console.log('Temperatura\t:',clima.temperatura);
                console.log('Máxima\t\t:', clima.maxima);
                console.log('Mínima\t\t:', clima.minima);
                console.log('Como está el clima: ', clima.desc.green)
                break;
            case 2:
                search.historialCapitalizado.forEach((lugar , i)  => {
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })
                break;
            default:
                break;
        }
        await pausaMenu();
    } while (opt !== 0);

}

main();