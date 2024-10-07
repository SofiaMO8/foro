var sesion = localStorage.getItem('usuario');

if (sesion === null || sesion === "null") {
    localStorage.setItem('usuario', JSON.stringify({}));
    window.location.href = "login.html";
}


function validarCorreo(correo) {
    var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    return regex.test(correo.trim());
  }

  function validarPassword(password) {
    var regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return regex.test(password.trim());
  }

const registrar = async ()=>{

    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("pass").value;
    let nombre = document.getElementById("nombre").value;
    let foto = document.getElementById("foto").files[0];
    
    if (usuario.trim() == "" || password === "" || nombre.trim() === "") {
        Swal.fire({title: "ERROR", text: "Campos vacíos", icon: "error"});
        return;
    }

    if (!validarCorreo(usuario)) {
        Swal.fire("ERROR", "Correo no valido", "error");
        return;
    }
    if (!validarPassword(password)) {
        Swal.fire("ERROR", "Contraseña no valida", "error");
        return;
    }

    let datos = new FormData();
    datos.append('email',usuario);
    datos.append('pass',password);
    datos.append('nombre',nombre);
    if (foto) {
        datos.append('foto',foto);
    }
    datos.append('action','registrar');

    let respuesta=await fetch("php/login.php",{method: 'POST', body: datos});
    let json = await respuesta.json();

    if (json.success==true) {
        Swal.fire({title: "¡REGISTRO EXITOSO!", text: json.mensaje, icon: "success"});
        notify();
        limpiar();
    } else {
        Swal.fire({title: "ERROR", text: json.mensaje, icon: "error"});
    }
}

const login = async () => {
    let usuario = document.getElementById('user').value;
    let password = document.getElementById("pass").value;

    if (usuario.trim() == "" || password == "") {
        Swal.fire({ title: "ERROR", text: "CAMPOS VACÍOS", icon: "error" });
        return;
    }

    if (!validarCorreo(usuario)) {
        Swal.fire({ title: "ERROR", text: "CORREO NO VÁLIDO", icon: "error" });
        return;
    }

    if (!validarPassword(password)) {
        Swal.fire({ title: "ERROR", text: "CONTRASEÑA NO VÁLIDA", icon: "error" });
        return;
    }

    let datos = new FormData();
    datos.append("usuario", usuario);
    datos.append("password", password);
    datos.append('action', 'login');

    let respuesta = await fetch("php/login.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    if (json.success == true) {
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("user", JSON.stringify({ idusuario: json.idusuario}));

        window.location.href = 'inicio.html';
    } else {
        Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
    }
};


const cargarNombre=async()=>{

    datos=new FormData();
    datos.append("usuario",sesion);
    datos.append("action","select");

    let respuesta=await fetch("php/login.php",{method:'POST',body:datos});
    let json=await respuesta.json();

    if (json.success == true) {
        document.getElementById("user").innerHTML = json.mensaje;
        document.getElementById("foto_perfil").src = json.foto; // La ruta ahora es relativa
    }else{
    Swal.fire({title:"ERROR",text:json.mensaje,icon:"error"});
    }
}

document.getElementById("salir").onclick=()=>{
    Swal.fire({
        title:"¿Está seguro de Cerrar Sesión?",
        showDenyButton:true,
        confirmButtonText:"Si",
        denyButtonText:`No`
    }).then((result)=>{
    if(result.isConfirmed){
    window.location.href="login.html"
    localStorage.clear();
    }
});
}


const cargarPerfil = async () => {
    const datos = new FormData();
    datos.append("usuario", sesion);
    datos.append("action", "perfil");

    try {
        const respuesta = await fetch("php/login.php", { method: 'POST', body: datos });
        const json = await respuesta.json();

        if (json.success) {
            document.getElementById("email").innerHTML = json.email;
            document.getElementById("nombre").value = json.nombre;
            document.getElementById("foto-preview").innerHTML = `<img src="${json.foto}" class="foto-perfil">`;
            document.getElementById("foto_perfil").src = json.foto;

        }else {
            Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({ title: "ERROR", text: "problema con la conexión", icon: "error" });
    }
};

const guardarPerfil = async (event) => {
    event.preventDefault(); 

    const formPerfil = document.getElementById("formPerfil");
    const datos = new FormData(formPerfil);
    datos.append("usuario", sesion);
    datos.append("action", "saveperfil");

    try {
        const respuesta = await fetch("php/login.php", { method: 'POST', body: datos });
        const json = await respuesta.json();

        if (json.success) {
            Swal.fire({ title: "¡ÉXITO!", text: json.mensaje, icon: "success" });
            document.getElementById("foto-preview").innerHTML = `<img src="php/${json.foto}" class="foto-perfil">`;
            document.getElementById("foto_perfil").src = `php/${json.foto}`;
        } else {
            Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({ title: "ERROR", text: "problema con la conexión", icon: "error" });
    }
};

function limpiar (){
    let usuario = document.getElementById("usuario");
    let password = document.getElementById("pass");
    let nombre = document.getElementById("nombre");
    let foto = document.getElementById("foto");

    usuario.value="";
    password.value="";
    nombre.value="";
    foto.value="";
}

function notify(){
    let nombre = document.getElementById("nombre").value;
    //verificar que el navegador soporta notificaciones 
    if (!("Notification" in window)) {
        Swal.fire({title: "ALGO SALIO MAL", text: "Tu navegador no soporta notificaciones", icon: "error"});

    }else if(Notification.permission === "granted"){
        //Lanzar notificacion si ya fue autorizado el servicio
        const notification = new Notification(`Hola un Gusto saludarte`, {
            icon: 'assets/img/foro.png',
            body: `Bienvenid@ ${nombre} a este tu nuevo hogar, puede proceder al Login`,
        });

        notification.onclick= function(){
            window.location.href = 'login.html';
        }

    }else if(Notification.permission !== "denied"){
        Notification.requestPermission(function(permission){

            if(Notification.permission === "granted"){
                var notification = new Notification("Registro exitoso!");
            }
        });
    }
}
