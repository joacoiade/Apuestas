//creaciòn de partidos
const partidos = [];

const partido1 = new Partido(1, "Nacional", "Peñarol", 2.10, 3.00, 2.50, "0");
const partido2 = new Partido(2, "River", "Boca", 1.90, 2.80, 2.30, "0");
const partido3 = new Partido(3, "Real Madrid", "Barcelona", 2.20, 2.90, 2.30, "0");
const partido4 = new Partido(4, "Sao Paulo", "Flamengo", 2.70, 2.40, 1.60, "0");
const partido5 = new Partido(5, "Inter", "Milan", 2.30, 2.80, 2.60, "0");
const partido6 = new Partido(6, "Liverpool", "Everton", 1.70, 2.30, 3.30, "0");
partidos.push(partido1);
partidos.push(partido2);
partidos.push(partido3);
partidos.push(partido4);
partidos.push(partido5);
partidos.push(partido6);

localStorage.setItem("partidos", JSON.stringify(partidos));

//mostrar éxito en apuesta
const apuestaExitosa = () =>{
    let opacidad = 1;
    
    $("#apuestaExito").css("opacity", opacidad);
    $("#apuestaExito").css("visibility", "visible");
    
    const borrarConfirmacion = setInterval(()=>{
        $("#apuestaExito").css("opacity", opacidad);
        opacidad -= 0.125;
    }, 1000);

    setTimeout(() => {
        $("#apuestaExito").css("visibility", "hidden");
        clearInterval(borrarConfirmacion);
    }, 10000);
}

//borrar texto de errores
const limpiar = ()=>{
    lblError.text("");
    lblErrorMonto.text("");
    lblErrorLiga.text("");
    lblErrorLiga.hide();
}

const setearError = (lblError, texto)=>{
    lblError.show();
    lblError.text("*")
    lblError.prop('title', texto);
}

//hacer la apuesta
const realizarApuesta = (e)=>{
    e.preventDefault();
    limpiar();

    const apuesta = JSON.parse(localStorage.getItem("apuesta"));
    //en caso de errores en el monto, no realizar nada
    if(isNaN(inputMonto.val().trim()) && inputMonto.val().trim() != "" || inputMonto.val().trim() == ""  || inputMonto.val().trim()%1 !=0)
    {
        setearError(lblErrorMonto, "Recuerda ingresar un monto valido, sin valores decimales");
    }
    else if (apuesta.juegos.length == 0)
    {
        setearError(lblErrorMonto, "No se han seleccionado apuestas");
    }
    else //se confirma la apuesta, se guarda en la memoria y se resetean los valores en pantalla
    {
        const apuesta = JSON.parse(localStorage.getItem("apuesta"));
        apuesta.ganar = inputTotal.val();
        apuesta.monto = inputMonto.val();

        const apuestasConfirmadas = JSON.parse(localStorage.getItem("apuestasConfirmadas")) || [];

        apuesta.id = apuestasConfirmadas.length + 1;

        apuestasConfirmadas.push(apuesta);

        localStorage.setItem("apuestasConfirmadas", JSON.stringify(apuestasConfirmadas));
        
        contenedorPartidos.empty();   

        inputMonto.val("");
        inputMultiplicador.val(1);
        inputTotal.val("");
        
        localStorage.setItem("apuesta", JSON.stringify(new Apuesta()));

        apuestaExitosa();
    }
}

//cancelar funcionlidad de enter
const cancelarEnter = (e)=>{
    if(e.key == "Enter"){
        e.preventDefault();
        return false;
    }
}
//mostrar total a apostar
const totalApostar = ()=>{
    lblErrorMonto.text("");
    if(isNaN(inputMonto.val().trim()) && inputMonto.val().trim() != "" || inputMonto.val().trim()%1 != 0)
    {
        setearError(lblErrorMonto, "Recuerda solo ingresar números, incluso sin valores decimales");
    }    
    else if(inputMonto.val().trim() == "")
    {
        inputTotal.val("");
    }
    else
    {
        inputTotal.val((parseFloat(inputMultiplicador.val()) * (parseInt(inputMonto.val()))).toFixed(2));
    }
}

//en caso de variación en el monto a apostar, calcular saldo total si corresponde por accionar de un evento
const montoApostar = (e)=>{
    e.preventDefault();

    totalApostar();
}

//calcular variaciòn del mutiplicador
const calcularApuesta = ()=>{
    const apuesta = JSON.parse(localStorage.getItem("apuesta")) || new Apuesta();
    let multiplicador = 1;

    if(apuesta.juegos.length != 0)
    {
        for(const juego of apuesta.juegos)
        {
            const seleccion = $("#partido" + juego.id);
            let operador = 1;
            if(seleccion.val() == "0")
            {   
                operador = juego.probabilidad[0];
            }
            else if(seleccion.val() == "1")
            {
                operador = juego.probabilidad[1];
            }
            else if(seleccion.val() == "2")
            {
                operador = juego.probabilidad[2];
            }
            multiplicador *= operador;
        }
    }
    inputMultiplicador.val(multiplicador.toFixed(2));
}

//calcular variaciòn del multiplicador a partir del accionar de un evento
const calculoApuestas =(e)=>{
    e.preventDefault()
    
    calcularApuesta();
}

//cambio de selecciòn de un juego
const modificarApuesta = (e)=>{
    e.preventDefault();
    limpiar();

    const apuesta = JSON.parse(localStorage.getItem("apuesta"));

    let idElegido = e.target.id;
    idElegido = idElegido.replace("partido", "");

    for(const juego of apuesta.juegos)
    {
        if(juego.id == idElegido)
        {
            juego.elegido = $("#" + e.target.id).val();
        }
    }
    
    localStorage.setItem("apuesta", JSON.stringify(apuesta));
    
    //vuelvo a calcular valores
    calcularApuesta();
    totalApostar();
}

//agregar un partido
const agregarJuego = (game)=>{
    const div = document.createElement("div");

    div.innerHTML = '<label>' + game.equipo1 + ' vs ' + game.equipo2 + '</label><select id="partido' + game.id + '">' +
                    '<option value="0">Gana Local</option><option value="1">Empate</option>' +
                    '<option value="2">Gana Visita</option></select><button id="eliminarId' + game.id + '" class="eliminar" type="submit">X</button>';
    
    div.className = "animacionAgregar";                    
    
    contenedorPartidos.append(div);
}

//eliminar uan apuesta
const eliminarApuesta = function(e){
    e.preventDefault();
    let id = e.target.id.replace("eliminarId", "");

    limpiar();
    
    const apuesta = JSON.parse(localStorage.getItem("apuesta"));

    apuesta.juegos = apuesta.juegos.filter(function(juego){
        return juego.id != id;
    })

    localStorage.setItem("apuesta", JSON.stringify(apuesta));
    
    const div = document.getElementById(e.target.id).parentNode;

    div.remove();

    //vuelvo a calcular los saldos
    calcularApuesta();
    totalApostar();    
}

//sumar partido a apuestas a realizar
const agregarApuesta = function(e){
    e.preventDefault();
    
    limpiar();
    
    const apuesta = JSON.parse(localStorage.getItem("apuesta")) || new Apuesta();
    const partidos = JSON.parse(localStorage.getItem("partidos"));
    let duplicado = true;
    
    //obtengo el partido seleccionado
    const match = partidos.find(partido => partido.id == this.id);

    //verifico si el partido elegido está en la apuesta
    for(const partido of apuesta.juegos)
    {
        if(match.id == partido.id)
        {
            duplicado = false;
        }
    }

    //agrego el partido o indico que ya fue agregado; de corresponder se agregan las funcionalidades correspondientes
    if(duplicado == true)
    {
        apuesta.juegos.push(match);
        localStorage.setItem("apuesta", JSON.stringify(apuesta));
        agregarJuego(match);
        $("#eliminarId" + match.id).click(eliminarApuesta);
        $("#partido" + match.id).change(modificarApuesta);
    }
    else
    {
        lblError.text("El partido " + match.equipo1 + " vs " + match.equipo2 + " ya ha sido seleccionado");
    }
}

//agregar funcionlidad al botón eliminar
const eliminar = () => {
    for(const btn of $(".eliminar")){
        btn.addEventListener("click", eliminarApuesta);
    }
}

//apuesta elegida para cada partido
const eleccionApuestas = ()=>{
    
    const apuesta = JSON.parse(localStorage.getItem("apuesta")) || new Apuesta();

    for(const juego of apuesta.juegos)
    {
        const seleccion = $("#partido" + juego.id);
        seleccion.val(juego.elegido);
        seleccion.change(modificarApuesta);
    }
}

//creaciòn de listado de apuestas inicial --ok
const listadoInicialApuestas = ()=>{   
    const apuesta = JSON.parse(localStorage.getItem("apuesta")) || new Apuesta();
    //agrego los partidos al html que ya tengo seleccionados y guardados en la memori

    for(const juego of apuesta.juegos)
    {
        agregarJuego(juego);
    }

    if(apuesta.juegos.length > 0)
    {
        //agrego funcionalidad
        eliminar();
        //muestro apuesta seleccionada
        eleccionApuestas();
    }
}

//crear listado de partidos
const listadoPartidos = ()=>{
    //borrado del html para no duplicar los partidos
    divPartidos.innerHTML = "";
    //creo titulo del div partidos
    const h1 = document.createElement("h1");
    h1.innerText= "Partidos";
    divPartidos.append(h1);
    
    const match = JSON.parse(localStorage.getItem("partidos"));
    //creaciòn de html de cada partido
    for(const partido of match)
    {   
        let div = document.createElement("div");
        div.innerHTML = '<div><p class="parrafo1">' + partido.equipo1 + '</p><p class="parrafo2">' + partido.probabilidad[0] + 
                        '</p></div><div><p class="parrafo1">Empate</p><p class="parrafo2">' + partido.probabilidad[1] + 
                        '</p></div><div><p class="parrafo1">' + partido.equipo2 + '</p><p class="parrafo2">' + partido.probabilidad[2] + "</p></div>";
        divPartidos.append(div);

        let boton = document.createElement("div");
        boton.className = "btnAgregar"
        boton.innerHTML = '<button id="' + partido.id + '">Agregar</button>';

        divPartidos.append(boton);

        //seteo funcionalidades de cada botón agregar
        $("#" + partido.id).click(agregarApuesta);
        $("#" + partido.id).click(calculoApuestas);
        $("#" + partido.id).click(montoApostar);
    }

    //seteo valores/acciones iniciales
    listadoInicialApuestas();
    calcularApuesta();
    inputMonto.keydown(cancelarEnter);
    inputMonto.keyup(montoApostar);
    btnApostar.click(realizarApuesta);
}

//muestra la sección apuesta
const mostrarSeccionApuesta = (e) =>{
    e.preventDefault();

    divPartidos.show();
    divApuestas.show();
    eleccionApostar.hide();
    eleccionLigas.show();
    datosLigas.hide();
}

//seteo incial de valores
listadoPartidos();
eleccionApostar.click(mostrarSeccionApuesta)
