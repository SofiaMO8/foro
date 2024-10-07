var user = JSON.parse(localStorage.getItem("user")) || {}; 

const guardarPost = async () => {
    let post = document.getElementById("post").value;
    let id = user.idusuario;

    if (post.trim() == "") {
        Swal.fire({ title: "ERROR", text: "Llena el campo del post", icon: "error" });
        return;
    }

    if (!user.idusuario) {
        Swal.fire({ title: "ERROR", text: "Usuario no identificado", icon: "error" });
        return;
    }
    
    let idusuario = user.idusuario;
    
    let datos = new FormData();
    datos.append("post", post);
    datos.append("idusuario", idusuario);
    datos.append("action", "publicar");

    try {
        let respuesta = await fetch("php/post.php", { method: 'POST', body: datos });
        let json = await respuesta.json();

        if (json.success == true) {
            Swal.fire({ title: "BIEN!", text: json.mensaje, icon: "success" });
            let postsIds = JSON.parse(localStorage.getItem("postsIds")) || [];
            postsIds.push(json.idpost);
            localStorage.setItem("postsIds", JSON.stringify(postsIds));
            limpiarP();
        } else {
            Swal.fire({ title: "ERROR!", text: json.mensaje, icon: "error" });
        }
        
    } catch (error) {
        Swal.fire({ title: "ERROR!", text: "No se pudo conectar con el servidor", icon: "error" });
        console.error("Error en la conexión:", error);
    }

    cargarPost();
}

const cargarPost = async () => {
    let datos = new FormData();
    datos.append("action", "cargarPost");
    let respuesta = await fetch("php/post.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    document.getElementById("divPosts").innerHTML = ""; 

    json.map(post => {
        let divPost = `
        <div class="card w-50 m-auto mt-3">
            <div class="card-header">
                <div class="col m-2">
                    <img src="${post.foto}" alt="User" width="40px" height="40px">
                    <b class="mx-1">${post.nombre}</b>
                    <small>${moment(post.fecha).format("D MMMM YYYY hh:mm A")}</small>
                </div>
            </div>
            <div class="card-body">
                <p>${post.post}</p>
            </div>
            <div class="card-footer d-flex align-items-center">
                <input type="text" class="form-control w-75" id="inputC_${post.idpost}" placeholder="Comentar">
                <button class="btn btn-dark mx-2 d-inline-block" onclick="comentario(${post.idpost})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M23 16.5a7.5 7.5 0 1 0 0-15a7.5 7.5 0 0 0 0 15m1-12.25V8h3.75a.75.75 0 0 1 0 1.5H24v3.75a.75.75 0 0 1-1.5 0V9.5h-3.75a.75.75 0 0 1 0-1.5h3.75V4.25a.75.75 0 0 1 1.5 0M6.5 3h9.792A9 9 0 1 0 30 14.657V19.5a4.5 4.5 0 0 1-4.5 4.5h-7.631l-6.571 5.603C9.999 30.71 8 29.787 8 28.08V24H6.5A4.5 4.5 0 0 1 2 19.5v-12A4.5 4.5 0 0 1 6.5 3"/></svg>
                </button>
            </div>
        </div>

        <div class="accordion w-50 m-auto" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${post.idpost}" aria-expanded="true" aria-controls="collapse${post.idpost}">
                        Comentarios
                    </button>
                </h2>
                <div id="collapse${post.idpost}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <!-- Contenedor de comentarios con un ID único -->
                        <div id="comen${post.idpost}"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("divPosts").innerHTML += divPost;

    cargarComentario(post.idpost); 
    });
}



cargarPost();



const miPost = async() =>{
    if (!user.idusuario) {
        Swal.fire({ title: "ERROR", text: "Usuario no identificado", icon: "error" });
        return;
    }
    
    let idusuario = user.idusuario;
    
    let datos = new FormData();
    datos.append("idusuario", idusuario);
    datos.append("action", "cargarMiPost");
    let respuesta = await fetch("php/post.php", { method: 'POST', body: datos });
    let json = await respuesta.json();
    var divPost2 = ``;

    json.map(post=>{
        moment.locale("es");
        moment().format("L");
        var fecha1 = moment(post.fecha).format("YYYY-MM-DD hh:mm A");
        var fecha2 = moment(post.fecha).format("D MMMM YYYY hh:mm A");
        var fecha3 = moment(post.fecha, "YYYY-MM-DD hh:mm:ss");

        divPost2+=`
           <div class="card w-50 m-auto mt-3">
        <div class="card-header">
            <div class="col m-2">
                <img src="${post.foto}" alt="User" width="40px" height="40px">
                <b class="mx-1">${post.nombre}</b>
                <small>${fecha2}</small>
            </div>
            <div class="card-body">
                <p class="">${post.post}</p>
            </div>
        </div>
    <div class="card-footer d-flex align-items-center">
        <input type="text" class="form-control w-75" id="inputC" placeholder="Comentar">
        <button class="btn btn-dark mx-2 d-inline-block" onclick="comentario(${post.idpost})">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                <path fill="currentColor" fill-rule="evenodd" d="M3 1a3 3 0 0 0-3 3v11.25a.75.75 0 0 0 1.28.53L4.063 13H13a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3zM1.5 4A1.5 1.5 0 0 1 3 2.5h10A1.5 1.5 0 0 1 14.5 4v6a1.5 1.5 0 0 1-1.5 1.5H3.443l-.22.22L1.5 13.44zM11 8a1 1 0 1 0 0-2a1 1 0 0 0 0 2M9 7a1 1 0 1 1-2 0a1 1 0 0 1 2 0M5 8a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/>
            </svg>
        </button>
    </div>


    </div>
     <div class="accordion w-50 m-auto" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${post.idpost}" aria-expanded="true" aria-controls="collapse${post.idpost}">
                        Comentarios
                    </button>
                </h2>
                <div id="collapse${post.idpost}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div id="comen${post.idpost}"></div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.getElementById("divMiPosts").innerHTML=divPost2;

        cargarComentario(post.idpost);
    })

}

const cargarComentario = async (idpost) => {
    let datos = new FormData();
    datos.append("action", "cargarComentario");
    datos.append("idpost", idpost);  // Asegúrate de que 'idpost' no sea undefined
    
    let respuesta = await fetch("php/comentario.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    var divComentario = ``;
    json.forEach(comentario => {
         divComentario += `
                <ul class="list-group list-group-flush">
                <li class="list-group-item">
                        <img src="${comentario.foto}" alt="User" width="40px" height="40px">
                        <b class="mx-1">${comentario.nombre}</b>
                        <small>${moment(comentario.fecha).format("D MMMM YYYY hh:mm A")}</small>
                        <p>${comentario.comentario}</p>
                </li>
                </ul>
        `;

        document.getElementById(`comen${idpost}`).innerHTML = divComentario;
    });
}



function limpiarP (){
    let post = document.getElementById("post");

    post.value="";
}