class Partido{
    constructor(id, equipo1, equipo2, x1, xo, x2, elegido){
        this.id = id;
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.elegido = elegido;
        this.probabilidad = [x1, xo, x2];
        this.resultado = "sin resultado";
    }
}

class Apuesta{
    constructor(){
        this.monto = 0;
        this.juegos = [];
        this.ganar = 1;
        this.resultadoTotal = "sin resultado";
    }
}