let color = "rgb(170, 231, 255)";

//cambios de color de bordes y texto
btnVerApuestas.mouseover(function () { 
   btnVerApuestas.css({"border-color": color,
                        "color": color}); 
});

btnVerApuestas.mouseout(function () { 
    btnVerApuestas.css({"border-color": "white",
                        "color": "white"}); 
});

btnInicio.mouseover(function () { 
   btnInicio.css({"border-color": color,
                  "color": color}); 
});

btnInicio.mouseout(function () { 
   btnInicio.css({"border-color": "white",
                  "color": "white"}); 
});

//verifico si hay sesion iniciada
const verificarLogueo = ()=>{
   const user = JSON.parse(localStorage.getItem("userLogueado"));

   if(user == null)
   {
       divContLog.style.display = "block";
       divContDesl.style.display = "none";
   }
   else
   {
       divContLog.style.display = "none";
       divContDesl.style.display = "block";
       lblNombreUsuario.text(user.nombreUsuario);
   }
}

