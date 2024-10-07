<?php
require_once "bd.php";

//$valido = array('success'=> false, 'mensaje'=>"");

if ($_POST) {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    switch ($action) {
        case 'registrar':

            $valido['success']=array('success'=>false,'mensaje'=>"");

            $a = $_POST['email'];
            $b = md5($_POST['pass']); 
            $c = $_POST['nombre'];
            $tipo = $_FILES['foto']['type'];
            $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
            $filename = "img_" . time() . "." . $extension;
            $fileTmpName = $_FILES['foto']['tmp_name'];
            $uploadDirectory = '../img_profile/';
            if (!is_dir($uploadDirectory)) {
                mkdir($uploadDirectory, 0755, true);
            }
            
    
    $filePath = $uploadDirectory . basename($filename);
    $filePath2 = "img_profile/" . basename($filename);

    if (move_uploaded_file($fileTmpName, $filePath)) {
        $check = "SELECT * FROM usuario WHERE email='$a'";
        $res = $cx->query($check);

        if ($res->num_rows==0) {
          $sql = "INSERT INTO usuario VALUES (null,'$a', '$b', '$c', '$filePath2')";

           if ($cx->query($sql)) {
             $valido['success']=true;
             $valido['mensaje']="REGISTRO EXITOSO";

           }else{
            $valido['success']=false;
            $valido['mensaje']="ALGO SALIO MAL EN EL REGISTRO"; 
           }

        }else{
            $valido['success']=false;
            $valido['mensaje']="USUARIO NO DISPONIBLE";
        }
    }

    echo json_encode($valido);
    break;

    case "login": 
        $valido = array('success' => false, 'mensaje' => "", 'idusuario' => null);            
        $a = $_POST['usuario'];
        $b = md5($_POST['password']);
        $check = "SELECT * FROM usuario WHERE email='$a' AND password='$b';";
        $res = $cx->query($check);
        
        if ($res->num_rows > 0) {
            $row = $res->fetch_array();
            $valido['success'] = true;
            $valido['mensaje'] = "SE INICIÓ CORRECTAMENTE";
            $valido['idusuario'] = $row['idusuario'];
        } else {
            $valido['success'] = false;
            $valido['mensaje'] = "USUARIO Y/O CONTRASEÑA INCORRECTO";
        }           
        echo json_encode($valido);
        break;
    

        case "select":
            header('Content-Type: application/json; charset=utf-8');
            $valido = array('success' => false, 'mensaje' => '', 'foto' => '');
        
            $a = $_POST['usuario'];
            $check = "SELECT * FROM usuario WHERE email='$a';";
            $res = $cx->query($check);
            
            if ($res->num_rows > 0) {
                $row = $res->fetch_array();
                $valido['success'] = true;
                $valido['mensaje'] = $row['nombre'];
                
                // Verifica si hay una imagen guardada en la base de datos
                if ($row['foto'] && !empty($row['foto'])) {
                    $valido['foto'] = $row['foto'];
                } else {
                    // Si no hay imagen, asigna una imagen por defecto
                    $valido['foto'] = "img/foro.png"; // Imagen por defecto
                }
            } else {
                $valido['success'] = false;
                $valido['mensaje'] = "Usuario no encontrado";
            }
            
            echo json_encode($valido);
            break;
        
        

            case "perfil":
                header('Content-Type: application/json; charset=utf-8');
                $valido = array('success' => false, 'mensaje' => '', 'email' => '', 'nombre' => '', 'foto' => '');
            
                $a = $_POST['usuario'];
                $check = "SELECT * FROM usuario WHERE email='$a';";
                $res = $cx->query($check);
                
                if ($res->num_rows > 0) {
                    $row = $res->fetch_array();
                    $valido['success'] = true;
                    $valido['email'] = $row['email'];
                    $valido['nombre'] = $row['nombre'];

                    if ($row['foto'] && !empty($row['foto'])) {
                        $valido['foto'] = $row['foto'];
                    } else {

                        $valido['foto'] = "img/foro.png";
                    }
                } else {
                    $valido['success'] = false;
                    $valido['mensaje'] = "Perfil no encontrado";
                }
                
                echo json_encode($valido);
                break;
            
            
                
                case "saveperfil":
                    header('Content-Type: application/json; charset=utf-8');
                    $valido = ['success' => false, 'mensaje' => '', 'foto' => ''];
                    
                    $nombre = $_POST['nombre'];
                    $email = $_POST['usuario']; 
                    $tipo = $_FILES['foto']['type'];
                    $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
                    $filename = "img_" . time() . "." . $extension;
                    $fileTmpName = $_FILES['foto']['tmp_name'];
                    $uploadDirectory = '../img/';

                    if (!is_dir($uploadDirectory)) {
                        mkdir($uploadDirectory, 0755, true);
                    }

                    $filePath = $uploadDirectory . basename($filename);
                    $filePath2 = "img/" . basename($filename);
                
                    if (move_uploaded_file($fileTmpName, $filePath)) {

                        $check = "UPDATE usuario SET nombre='$nombre', foto='$filePath2' WHERE email='$email'";
                        
                        if ($cx->query($check) === TRUE) {
                            $valido['success'] = true;
                            $valido['mensaje'] = "SE GUARDÓ CORRECTAMENTE";
                            $valido['foto'] = $filePath2; 
                        } else {
                            $valido['success'] = false;
                            $valido['mensaje'] = "ALGO SALIÓ MAL EN LA ACTUALIZACIÓN";
                        }
                    } else {
                        $valido['success'] = false;
                        $valido['mensaje'] = "ALGO SALIÓ MAL AL SUBIR LA IMAGEN";
                    }
                
                    echo json_encode($valido);
                    break;
                
}
}
?>
