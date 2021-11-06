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

    const user = JSON.parse(localStorage.getItem("userLogueado"));
    const apuesta = JSON.parse(localStorage.getItem("apuesta")) || new Apuesta();
    //possiles errores: no logueo, no ingresar monto correcto, no tener apuestas
    if(user == null)
    {
        setearError(lblErrorMonto, "Debes estar logueado para apostar");
    }
    else if(isNaN(inputMonto.val().trim()) && inputMonto.val().trim() != "" || inputMonto.val().trim() == ""  || inputMonto.val().trim()%1 !=0)
    {
        setearError(lblErrorMonto, "Recuerda ingresar un monto valido, sin valores decimales");
    }
    else if (apuesta.juegos.length == 0)
    {
        setearError(lblErrorMonto, "No se han seleccionado apuestas");
    }/* 
    else if(apuesta.juegos.length == 0)
    {
        setearError(lblErrorMonto, "No se han seleccionado apuestas");
    } */
    else //se confirma la apuesta, se guarda en la memoria y se resetean los valores en pantalla
    {
        const usuarios = JSON.parse(localStorage.getItem("usuarios"));
        const userReal = usuarios.find(usuario => usuario.nombreUsuario == user.nombreUsuario);
        apuesta.ganar = inputTotal.val();
        apuesta.monto = inputMonto.val();

        apuesta.id = userReal.apuestas.length + 1;

        for(const usuario of usuarios)
        {
            if(usuario.nombreUsuario == userReal.nombreUsuario)
            {
                usuario.apuestas.push(apuesta);
            }
        }

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        contenedorPartidos.empty();   
        inputMonto.val("");
        inputMultiplicador.val(1);
        inputTotal.val("");
        for(const btn of btnsAgregar)
        {
            btn.textContent = "Agregar";
        }
        
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

    div.innerHTML = '<label class="apuestas__texto">' + game.equipo1 + ' vs ' + game.equipo2 + '</label><select class="apuestas__seleccionar" id="partido' + game.id + '">' +
                    '<option value="0">Gana Local</option><option value="1">Empate</option>' +
                    '<option value="2">Gana Visita</option></select><button id="eliminarId' + game.id + '" class="eliminar" type="submit">X</button>';
    
    div.className = "animacionAgregar";  
    
    contenedorPartidos.append(div);
}

//eliminar apuesta genérico
const eliminarApuestaGeneral = function(id){
    let idEliminar = "eliminarId" + id;

    const apuesta = JSON.parse(localStorage.getItem("apuesta"));

    apuesta.juegos = apuesta.juegos.filter(function(juego){
        return juego.id != id;
    })

    localStorage.setItem("apuesta", JSON.stringify(apuesta));
    
    const div = document.getElementById(idEliminar).parentNode;

    div.remove();

    //vuelvo a calcular los saldos
    calcularApuesta();
    totalApostar();
    
    $("#" + id).text("Agregar");
}

//eliminar uan apuesta desde apuesta a realizar
const eliminarApuesta = function(e){
    e.preventDefault();
    let id = e.target.id.replace("eliminarId", "");

    limpiar();
    
    eliminarApuestaGeneral(id);
}

//sumar partido a apuesta a realizar o eliminarlo
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
        $("#" + match.id).text("Eliminar");
    }
    else
    {
        eliminarApuestaGeneral(match.id);
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
        $("#" + juego.id).text("Eliminar");
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
        boton.innerHTML = '<button class="btnAgrEli" id="' + partido.id + '">Agregar</button>';

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
    eleccionApostar.hide();

    verificarLogueo();
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
