<?php
header('content-Type: application/json');
require_once "base.php";

if ($_POST) {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    switch ($action) {
        case 'comentar':

            $valido['success']=array('success'=>false,'mensaje'=>"");

            $comentario = $_POST['comenta'];
            $idU = $_POST['idusuario'];
            $idP = $_POST['idpost'];

            $sql = "INSERT INTO comentario VALUES (null,'$comentario',null,$idU,$idP)";
            if ($cx->query($sql)) {
                $valido['success']=true;
                $valido['mensaje']="SE PUBLICO CORRECTAMENTE";
              }else{
               $valido['success']=false;
               $valido['mensaje']="ALGO SALIO MAL EN LA PUBLICACION"; 
       }
   
       echo json_encode($valido);
       break;

       case 'cargarComentario':
        $idP = $_POST['idpost'];
        $result = $cx->query("SELECT usuario.idusuario,usuario.nombre,usuario.foto,comentario.comentario,comentario.idcomentario,comentario.fecha
         FROM comentario INNER JOIN usuario ON (usuario.idusuario = comentario.idusuario) WHERE comentario.idpost = '$idP'");

        $rows = array();
        while ($row = $result->fetch_assoc()){
            $rows[] = $row;
        }
        echo json_encode($rows);
        break;
            
}
}

?>