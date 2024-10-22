<?php
    $id_player = $_POST['id_player'];
    $steep = $_POST['steep'];

    // Connexion à la base de données
    include 'connexion.php';

    // Requête pour mettre à jour l'emplacement du pion
    $sql = "UPDATE joueurs_actifs SET steep = '$steep' WHERE id_joueur = '$id_player'";
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


    // Vérification si la requête a réussi
    if ($result) {
        // Si la mise à jour a réussi, retourner une confirmation
        echo json_encode(["counter" => $counter_modif]);
    } else {
        // En cas d'échec de la requête, afficher une erreur
        echo json_encode(["error" => "Update failed: " . mysqli_error($conn)]);
    }

    mysqli_close($conn);
?>