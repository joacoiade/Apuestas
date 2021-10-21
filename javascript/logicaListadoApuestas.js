
//función para calcular de forma aleatoria el resultado de una apuesta, partido a partido
const calcularPartido = (e) =>{
    e.preventDefault();
    //id de apuesta seleccionad
    let valorId = e.target.id;
    let id = valorId.replace("Calcular", "");
    
    //lista de apuestas confirmadas
    const lista = JSON.parse(localStorage.getItem("apuestasConfirmadas"));
    //busco que existe la apuesta seleccionada
    const apuesta = lista.find(game => game.id == id);

    let res = 0;
    let ganador = true;
    //recorro cada partido de la apuesta
    for(let i=0; i<apuesta.juegos.length; i++)
    {
        //obtengo un resultado y seteo si se acertó o no el resultado
        res = Math.floor(Math.random() * 3);
        if(res == apuesta.juegos[i].elegido)
            apuesta.juegos[i].resultado = "Acertó";
        else
        {
            apuesta.juegos[i].resultado = "No Acertó";
            ganador = false;
        }    
    }
    //verificador que indicó si existe algún partido donde no haya ganado
    if(ganador) apuesta.resultadoTotal = "Ganó";
    else apuesta.resultadoTotal = "Perdió";
    //edito la apuesta en el listado y lo vuelvo a subir a la sesion
    lista[id - 1] = apuesta;
    localStorage.setItem("apuestasConfirmadas", JSON.stringify(lista));
    //vuelvo a mostrar listado actualizado
    listaApuestas();
}

//muestra o desaparece el div con la especificación de las apuestas
const expandirPestaña = (e)=>{
    e.preventDefault();

    //obtengo div a desplegar
    let id = (e.target.id).replace("Expandir", "apuestas__expandir");
    const divPartidos = $("#" + id);

    //caso en que va a aparecer, con animación aplicada
    if(divPartidos.is(":hidden"))
    {
        divPartidos.slideDown("slow")
                    .css("border", "5px solid white")
                    .delay(1000)
                    .animate({"border-width":'3px'}, "slow");
    }//caso en que desaparece el div
    else{
        divPartidos.slideUp("slow")
    }
}

//lista de apuestas
const listaApuestas = ()=>{
    //obtengo de la sesión las apuestas confirmadas
    const lista = JSON.parse(localStorage.getItem("apuestasConfirmadas"));
    divApuestasConfirmadas.empty();

    //recorro la lista de apuestas y muestro cada apuesta
    for(const apuesta of lista)
    {
        //creo el div contenedor de la info particular de cada partido y seteo propiedades
        const div = document.createElement("div");
        div.className="apuestas__partidos";
        div.setAttribute("id", "apuestas__expandir" + apuesta.id);

        //info global de una apuesta a mostrar 
        const divTitularApuesta = document.createElement("div");
        divTitularApuesta.innerHTML = '<div class="apuestas__expandir"><button id="Expandir' + apuesta.id + 
                                    '">...</button></div><div class="apuestas__parrafoTotal">Gana $ ' + apuesta.ganar + 
                                    ' - Apostado $ ' + apuesta.monto + ' - ' + apuesta.resultadoTotal +
                                    '</div><div class="apuestas__parrafoBoton"><button id="Calcular' + 
                                    apuesta.id + '">Cacular</button></div>';
        //seteo del nombre de clase
        divTitularApuesta.className = "apuestas__total";

        //agrego al 
        divApuestasConfirmadas.append(divTitularApuesta);

        //recorro cada partido y muestro la info
        for(const juego of apuesta.juegos)
        {
            let teamElegido = "";
            let multiplicador = 1;

            //creo div de 1 juego
            const bloqueJuego = document.createElement("div");
            
            //seteo elecciòn a mostrar
            if(juego.elegido == "0")
            {   
                teamElegido = juego.equipo1;
                multiplicador = juego.probabilidad[0];
            }
            else if(juego.elegido == "1")
            {
                teamElegido = "Empate";
                multiplicador = juego.probabilidad[1];
            }
            else if(juego.elegido == "2")
            {
                teamElegido = juego.equipo2;
                multiplicador = juego.probabilidad[2];
            }

            //contenido del div de cada juego
            bloqueJuego.innerHTML = '<p>' + juego.equipo1 + ' vs ' + juego.equipo2 + '</p>';
            bloqueJuego.innerHTML += '<p>Opción: ' + teamElegido + ' - ' + multiplicador + '</p>';
            bloqueJuego.innerHTML += '<p>' + juego.resultado + '</p>';

            //agrego la info al div contenedor
            div.appendChild(bloqueJuego);
        }
        //agrego al div de inicio
        divApuestasConfirmadas.append(div);

        //sumo funcionalidad a la página
        const botonCal = document.getElementById("Calcular" + apuesta.id);
        botonCal.addEventListener("click", calcularPartido);

        const botonExp = document.getElementById("Expandir" + apuesta.id);
        botonExp.addEventListener("click",expandirPestaña);
        
        //muestro botòn para calcular resultado
        if(apuesta.resultadoTotal != "sin resultado")
        {
            botonCal.style.display = "none";
        }
    }
    //no visibilidad de la info específica de cada partido en una apuesta
    for(const expandir of $(".apuestas__partidos"))
    {
        expandir.style.display = "none";
    }
}



listaApuestas();