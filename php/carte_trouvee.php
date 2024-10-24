<?php
    $id_carte = $_POST['id_carte'];
    $id_player = $_POST['id_player'];
    // Connexion à la base de données
    include 'connexion.php';


    $sql = "SELECT cards.etat, emplacement.val
            FROM cards 
            LEFT JOIN emplacement ON cards.id_emplacement_link = emplacement.id_emplacement
            WHERE id_card = '$id_carte'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $etat = $row['etat'];
    $val = $row['val'];

    if($etat == 0){
        $sql = "UPDATE cards SET etat = 1 WHERE id_card = '$id_carte'";
        $result = mysqli_query($conn, $sql);

        $sql = "UPDATE joueurs_actifs SET score = score + '$val' WHERE id_joueur = '$id_player'";
        $result = mysqli_query($conn, $sql);

        $sql = "UPDATE parties SET counter_modif = counter_modif + 1 WHERE id_partie = (SELECT id_partie_link FROM joueurs_actifs WHERE id_joueur = '$id_player')";
        $result = mysqli_query($conn, $sql);
    
        $sql = "SELECT counter_modif FROM parties WHERE id_partie = (SELECT id_partie_link FROM joueurs_actifs WHERE id_joueur = '$id_player')";
        $result = mysqli_query($conn, $sql);
    
        //recuperation du counter_modif unique
        $counter_modif = mysqli_fetch_assoc($result);
        $counter_modif = $counter_modif['counter_modif'];
    
        //set cookie
        setcookie("counter", $counter_modif, time() + 3600, "/", "", false, true);
    }


    // Vérification si la requête a réussi
    if ($result) {
        // Si la mise à jour a réussi, retourner une confirmation
        echo json_encode(["etat" => $etat,"val" => $val]);
    } else {
        // En cas d'échec de la requête, afficher une erreur
        echo json_encode(["error" => "Update failed: " . mysqli_error($conn)]);
    }

    mysqli_close($conn);
?>