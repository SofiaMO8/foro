var user = JSON.parse(localStorage.getItem("user")) || {}; 
var postId = localStorage.getItem("postsIds") || [];


const comentario = async (idpost) => {
    let comenta = document.getElementById(`inputC_${idpost}`).value;
    let idusuario = user.idusuario;

    if (comenta.trim() == "") {
        Swal.fire({ title: "ERROR", text: "Llena el campo del comentario", icon: "error" });
        return;
    }

    if (!user.idusuario) {
        Swal.fire({ title: "ERROR", text: "Usuario no identificado", icon: "error" });
        return;
    }

    if (!idpost) {
        Swal.fire({ title: "ERROR", text: "Post no identificado", icon: "error" });
        return;
    }

    let datos = new FormData();
    datos.append("comenta", comenta);
    datos.append("idusuario", idusuario);
    datos.append("idpost", idpost);
    datos.append("action", "comentar");

    try {
        let respuesta = await fetch("php/comentario.php", { method: 'POST', body: datos });
        let json = await respuesta.json();

        if (json.success) {
            Swal.fire({ title: "BIEN!", text: json.mensaje, icon: "success" });
            document.getElementById(`inputC_${idpost}`).value = "";
            location.reload();
        } else {
            Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        }
        
    } catch (error) {
        Swal.fire({ title: "ERROR", text: "No se pudo conectar con el servidor", icon: "error" });
        console.error("Error en la conexión:", error);
    }
}

