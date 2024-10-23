<?php
    $id_player = $_POST['id_player'];
    $id_partie = $_POST['id_partie'];
    $txt = $_POST['txt'];

    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour créer une partie
    $sql = "INSERT INTO log_messages (id_player_link,id_partie_link, txt) VALUES ('$id_player','$id_partie', '$txt')";
    $result = mysqli_query($conn, $sql);

    $sql = "UPDATE parties SET counter_modif = counter_modif + 1 WHERE id_partie = (SELECT id_partie_link FROM joueurs_actifs WHERE id_joueur = '$id_player')";
    $result = mysqli_query($conn, $sql);


    mysqli_close($conn);
?>
