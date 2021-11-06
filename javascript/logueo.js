function seteoID (e){ 
    e.preventDefault();
    hdnOpcion.val(e.target.id);

    if(e.target.id == "loguear")
        $("#exampleModalLabel").text("LOGUEO");
    else
        $("#exampleModalLabel").text("REGISTRAR");    
}

const borrar = function (){
    lblErrorNick.hide();
    lblErrorPass.hide();
    lblErrorLogueo.hide();
    lblErrorLogueo.text("");    
}

function cancelar(e){
    e.preventDefault();
    borrar();
    inputNick.val("");
    inputPass.val("");
}

const validacion = (lblError, texto, mensaje)=>{
    lblError.show();
    lblError.text(texto);
    if(texto == "*")
    {
        lblError.prop("title", mensaje);
    }
}

function Logueo(e, pagina){
    e.preventDefault();
    borrar();
    if(pagina == "index")
        limpiar();
            
    let nick = inputNick.val().trim().toUpperCase();
    let pass= inputPass.val().trim().toUpperCase();

    if(nick =="" || pass==""){
        if(nick == "") validacion(lblErrorNick, "*", "Debes ingresar un valor");
        
        if(pass ==  "") validacion(lblErrorPass, "*", "Debes ingresar un valor");
    }
    else{
        if(hdnOpcion.val() == "loguear") loguear(nick, pass, pagina);
        else crearUsuario(nick, pass, pagina);
    }
}

const loguear = (nick, pass, pagina)=>{
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if(listaUsuarios.length == 0)
    {
        validacion(lblErrorLogueo, "No te encuentras registrado", "");
    }
    else
    {
        const user = listaUsuarios.find(usuario=>
            usuario.nombreUsuario == nick);

        if(user == undefined)
        {   
            validacion(lblErrorLogueo, "No existe ese nombre de Usuario", "");
        }
        else if (user.contraseña != pass)
        {
            validacion(lblErrorLogueo, "Usuario o contraseña no coinciden", "");
        }
        else
        {
            datosLogueo(user, pagina);
        }
    }
}

const datosLogueo = (user, pagina)=>{
    mdlLogueo.modal("hide");    
    divContLog.style.display = "none";
    divContDesl.style.display = "block";
    lblNombreUsuario.text(user.nombreUsuario);
    localStorage.setItem("userLogueado", JSON.stringify(user));
    if(pagina == "listado")
                listaApuestas();
}   

const agregarUsuario = (nick, pass, lista, pagina)=>{
    const user = new Usuario(nick, pass);
    
    lista.push(user);
    localStorage.setItem("usuarios", JSON.stringify(lista));
    datosLogueo(user, pagina);

}

const crearUsuario = (nick, pass, pagina)=>{
    const listaUsuario = JSON.parse(localStorage.getItem("usuarios")) || [];

    if(nick.length > 14)
    {
        validacion(lblErrorLogueo, "No incluir más de 14 caracteres en el Usuario", "");
    }
    else if(listaUsuario.length == 0) 
    {
        agregarUsuario(nick, pass, listaUsuario, pagina);
    }
    else
    {
        const user = listaUsuario.find(usuario=> usuario.nombreUsuario == nick);
        if(user == undefined)
        {
            agregarUsuario(nick, pass, listaUsuario, pagina);
        }
        else
            validacion(lblErrorLogueo, "Existe Usuario ingresado", "");

    }
}

function desloguear(e, pagina){
    e.preventDefault();

    localStorage.setItem("userLogueado", JSON.stringify(null));
    divContDesl.style.display = "none";
    divContLog.style.display="block";

    if(pagina == "index")
        limpiar();
    else
        listaApuestas();

    borrar();
    inputNick.val("");
    inputPass.val("");
}