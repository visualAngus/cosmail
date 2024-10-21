<?php
    $id_player = $_POST['id_player'];
    $txt = $_POST['txt'];

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Fonction pour créer une partie
    $sql = "INSERT INTO chat (id_player_link, chat) VALUES ('$id_player', '$txt')";
    $result = mysqli_query($conn, $sql);

    $sql = "UPDATE parties SET counter_modif = counter_modif + 1 WHERE id_partie = (SELECT id_partie_link FROM joueurs_actifs WHERE id_joueur = '$id_player')";
    $result = mysqli_query($conn, $sql);


    mysqli_close($conn);
?>
