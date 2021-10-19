const btnVer = $("#eleccion__btnLigas");

const agregarCelda = (fila, contenido, tipoCelda) =>{
    const celda = document.createElement(tipoCelda);
    celda.textContent = contenido; 
    fila.appendChild(celda);
}

const agregarCeldas = (contenedorTabla, tabla)=>{
    for(let i = 0; i < tabla.length; i++)
    {
        if(i == 0)
        {    
            const propiedades = Object.keys(tabla[i]);
            const listaProp = propiedades.filter(propiedad => propiedad != "form");
            const filaInicial = document.createElement("tr");
        
            for(let i=0; i < listaProp.length; i++)
            {    
                if(listaProp[i] != "team")
                {
                    agregarCelda(filaInicial, listaProp[i], "th");
                }
                else
                {
                    agregarCelda(filaInicial, "name", "th");
                }    
            }
            contenedorTabla.appendChild(filaInicial);
        }
        
            const fila = document.createElement("tr");
            const datosLiga = tabla[i];
            delete datosLiga.form;
            
            for(const propiedad in datosLiga)
            {
                if(propiedad != "team")
                {
                    agregarCelda(fila, datosLiga[propiedad], "td");
                }
                else
                {
                    agregarCelda(fila, datosLiga[propiedad].name, "td");
                }
            }
        contenedorTabla.appendChild(fila);
    }
}

btnVer.click( function(e) {
    e.preventDefault();
    limpiar();

    const valor = $("#competicion").val();

    if(valor == "")
    {
        setearError(lblErrorLiga, "Debes elegir una liga");
    }
    else if(valor == "CL" || valor == "EC" || valor == "CLI" || valor=="WC")
    {
        setearError(lblErrorLiga, "Liga actualmente no disponible");
    }
    else
    {
        let apiUrl = 'http://api.football-data.org/v2/competitions/' + valor + '/standings';

        $.ajax({
            headers: { 'X-Auth-Token': 'a0ae58926fc442b099059cfbc533c5d5' },
            url: apiUrl,
            dataType: 'json',
            method: 'GET',
            success: (resp)=>{

                datosLigas.show();
                datosLigas.empty();
                divPartidos.hide();
                divApuestas.hide();


                const contenedorTabla = document.createElement("table");

                let tabla = resp.standings[0].table;

                agregarCeldas(contenedorTabla, tabla);
                
                datosLigas.append(contenedorTabla);

                eleccionApostar.show();
                eleccionLigas.hide();
            }
        });
    } 
});

const cargarInicio = ()=>{
    let apiUrl = 'http://api.football-data.org/v2/competitions?plan=TIER_ONE';

        $.ajax({
            headers: { 'X-Auth-Token': 'a0ae58926fc442b099059cfbc533c5d5' },
            url: apiUrl,
            dataType: 'json',
            method: 'GET',
            success: (resp)=>{
                console.log(resp);
                const paises = resp;

                const seleccionPais = document.getElementById("competicion");
                /*
                const opcion = document.createElement("option");
                opcion.value = null;
                opcion.text = "Seleccionar Liga";
                seleccionPais.prepend(opcion);
                */ 
                for(let i=0; i < paises.competitions.length; i++)
                {
                    const opcion = document.createElement("option");
                    opcion.value = paises.competitions[i].code;
                    opcion.text = paises.competitions[i].name;

                    seleccionPais.appendChild(opcion);
                }
            }
        });
}

if(eleccionLigas.is(":visible"))
{
    cargarInicio();        
}