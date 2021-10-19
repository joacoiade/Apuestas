
const partidos = [];

class Partido{
    constructor(id, equipo1, equipo2, x1, xo, x2){
        this.id = id;
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.probabilidad = [x1, xo, x2];
    }
}

const partido1 = new Partido(1, "Nacional", "Peñarol", 2.10, 3.00, 2.50);
const partido2 = new Partido(2, "River", "Boca", 1.90, 2.80, 2.30);
const partido3 = new Partido(3, "Real Madrid", "Barcelona", 2.20, 2.90, 2.30);
const partido4 = new Partido(4, "Sao Paulo", "Flamengo", 2.70, 2.40, 1.60);
const partido5 = new Partido(5, "Inter", "Milan", 2.30, 2.80, 2.60);
const partido6 = new Partido(6, "Liverpool", "Everton", 1.70, 2.30, 3.30);
partidos.push(partido1);
partidos.push(partido2);
partidos.push(partido3);
partidos.push(partido4);
partidos.push(partido5);
partidos.push(partido6);

class Apuesta{
    constructor(){
        this.opcion = [];
        this.monto = 0;
        this.juegos = [];
        this.ganar = 1;
    }

    //elección de a que partido y que resultado se apuesta
    partidoApostar(){
        let validacion = true;
        let error = "SI";
        let match = 0;
        let eleccion;

        while(error.toUpperCase() == "SI")
        {
            //elegir que partido se quiere apostar
            do{
                match = prompt("Partidos a apostar: \n1 - Nacional vs Peñarol \n2 - River vs Boca" +
                    "\n3 - Real Madrid vs Barcelona \n4 - Sao Paulo vs Flamengo \n5 - Inter vs Milan" + 
                    "\n6 - Liverpool vs Everton \n Elegir Opción:");

                if(match <= 6 && match >= 1  && match % 1 == 0)
                {
                    eleccion = partidos[match - 1];
                    let duplicado = false;

                    //verifico si el partido elegido ya se encuentra dentro de las apuestas que realizó el user
                    for(let i=0; i<this.juegos.length; i++)
                    {
                        if(eleccion.id == this.juegos[i].id)
                        {
                            alert("Ya has elegido el partido entre " + eleccion.equipo1 + " vs " + eleccion.equipo2 +
                            ". Prueba eligiendo otro.");
                            duplicado = true;
                        }
                    }
                    //si no se ha elegido lo agregó a las apuestas
                    if(duplicado == false)
                    {
                        this.juegos.push(eleccion); 
                        validacion = false;
                    }
                }
                else
                {
                    alert("No has elegido una opción correcta. Vuelve a probar");
                }
            }while(validacion == true);

            //opción que elige el user
            do{
                let elegir = prompt("Opción 1: Gana " + eleccion.equipo1 + " paga " + eleccion.probabilidad[0] +
                    "\nOpción 2: Empate paga " + eleccion.probabilidad[1] + "\nOpción 3: Gana " + eleccion.equipo2 + 
                    " paga " + eleccion.probabilidad[2] + "\n Elegir opción (1, 2 o 3):");
                
                    if(elegir != "1" && elegir != "2" && elegir != "3")
                    {   
                        alert("No has elegido una opción correcta. Vuelve a probar");
                    }
                    else
                    {
                        this.opcion.push(elegir);
                        validacion = true;
                    }
            }while(validacion == false);
            
            //no dejar continuar si ya eligió todos los partidos disponibles
            if(this.juegos.length == 6)
            {
                alert("No hay más juegos disponibles para apostar. Buena suerte!!");
                error = "NO";
            }
            else
            {
                //consulto si quiere sumar otro partido a la apuesta
                do{
                    error = prompt("¿Deseas apostar a otro partido? (Si o No)");
                }while(error.toUpperCase() != "SI" && error.toUpperCase() != "NO"); 
            }
        }
    }
    
    //monto que quiere apostar el user
    valorApostado(){
        let error = true;
        this.monto = prompt("Monto a apostar (en $ y con '.' para separar valor decimal):");
        while(error == true)
        {
            if(isNaN(this.monto))
            {   
                alert("Recuerda elegir un monto correcto. Vuelve a probar.");
                this.monto = prompt("Monto a apostar (en $ y con '.' para separar valor decimal):");
            }
            else
            {
                error = false;
            }
        }
    }

    apuestaRealizada(){
        
        for(let i=0; i < this.juegos.length; i++)
        {
            if(this.opcion[i] == "1")
                this.ganar *= this.juegos[i].probabilidad[0];
            else if(this.opcion[i] == "2")
                this.ganar *= this.juegos[i].probabilidad[1];
            else if(this.opcion[i] == "3")
                this.ganar *= this.juegos[i].probabilidad[2];
        }
        this.ganar *= this.monto;
        alert("De acertar a todos los partidos cobrarás $" + this.ganar);
    }
}

//Math.floor(Math.random() * (max - min + 1)) + min
function resultado(timba){
    let resultado = [];
    let acertar = true;

    for(let i=0; i<timba.opcion.length; i++)
    {
        resultado[i] = Math.floor(Math.random() * 3) + 1;
        if(resultado[i] != timba.opcion[i])
            acertar = false;
    }    

    if(acertar == true)
    {
        alert("Has acertado el/los partidos. Cobrás $ " + timba.ganar);
    }
    else
    {
        alert("Has perdido. No has acertado al menos a un resultado.");
    }
    
    console.log(resultado);
    console.log(timba.opcion);
}

const apuesta1 = new Apuesta();
apuesta1.partidoApostar();
apuesta1.valorApostado();
apuesta1.apuestaRealizada();

resultado(apuesta1);