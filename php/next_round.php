<?php
    $num_player = $_POST['num_player'];
    $id_partie = $_POST['id_partie'];
    $id_player = $_POST['id_player'];

    // Connexion à la base de données
    include 'connexion.php';

    $sql = "SELECT nb_joueur FROM parties WHERE id_partie = '$id_partie'";
    $result = mysqli_query($conn, $sql);
    $nb_joueur = mysqli_fetch_assoc($result);
    $nb_joueur = $nb_joueur['nb_joueur'];


    $sql = "SELECT numero_joueur FROM joueurs_actifs WHERE id_joueur = '$num_player' AND id_partie_link = '$id_partie'";
    $result = mysqli_query($conn, $sql);
    $num_player = mysqli_fetch_assoc($result);
    $num_player = $num_player['numero_joueur'];

    if((int)$nb_joueur < (int)$num_player + 1){
        $num_player = 1;
    }else{
        $num_player = $num_player + 1;
    }

    // Requête pour mettre à jour l'emplacement du pion
    $sql = "UPDATE parties SET tour_de_jeu = $num_player WHERE id_partie  = $id_partie";
    $result = mysqli_query($conn, $sql);

    $sql = "UPDATE parties SET counter_modif = counter_modif + 1 WHERE id_partie = $id_partie";
    $result = mysqli_query($conn, $sql);


    $sql = "SELECT id_joueur FROM joueurs_actifs WHERE numero_joueur = '$num_player' AND id_partie_link = '$id_partie'";
    $result = mysqli_query($conn, $sql);
    $nb_joueur = mysqli_fetch_assoc($result);
    $nb_joueur = $nb_joueur['id_joueur'];

    $sql = "UPDATE joueurs_actifs SET steep = 0 WHERE id_joueur = $nb_joueur AND id_partie_link = $id_partie";
    $result2 = mysqli_query($conn, $sql);

    
    $sql = "UPDATE parties SET counter_modif = counter_modif + 1 WHERE id_partie = (SELECT id_partie_link FROM joueurs_actifs WHERE id_joueur = '$id_player')";
    $result = mysqli_query($conn, $sql);

    // Vérification si la requête a réussi
    if ($result) {
        // Si la mise à jour a réussi, retourner une confirmation
        echo json_encode(["nb_joueur" => $nb_joueur]);
    } else {
        // En cas d'échec de la requête, afficher une erreur
        echo json_encode(["error" => "Update failed: " . mysqli_error($conn)]);
    }

    mysqli_close($conn);
?>