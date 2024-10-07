<?php
header('content-Type: application/json');
require_once "base.php";

if ($_POST) {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    switch ($action) {
        case 'publicar':

            $valido['success']=array('success'=>false,'mensaje'=>"", 'idpost' => null);

            $post = $_POST['post'];
            $id = $_POST['idusuario'];

            $sql = "INSERT INTO post VALUES (null,'$post',null,'$id')";
            if ($cx->query($sql)) {
                $valido['success']=true;
                $valido['mensaje']="SE PUBLICO CORRECTAMENTE";
              }else{
               $valido['success']=false;
               $valido['mensaje']="ALGO SALIO MAL EN LA PUBLICACION"; 
       }
   
       echo json_encode($valido);
       break;

       case 'cargarPost':
        $result = $cx->query("SELECT usuario.idusuario,usuario.nombre,usuario.foto,post.post,post.fecha,post.idpost
        FROM post INNER JOIN usuario ON(usuario.idusuario=post.idusuario) ORDER BY post.fecha DESC");
        $rows = array();
        while ($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
        echo json_encode($rows);
        break;

   case 'cargarMiPost':
    $id = $_POST['idusuario'];
    $result = $cx->query("SELECT usuario.idusuario, usuario.nombre, usuario.foto, post.post, post.fecha, post.idpost
    FROM post INNER JOIN usuario ON usuario.idusuario = post.idusuario WHERE usuario.idusuario = $id ORDER BY post.fecha DESC;");
    $rows = array();
    while ($row = $result->fetch_assoc()){
        $rows[] = $row;
    }
        echo json_encode($rows);
        break;
            
}
}

?>