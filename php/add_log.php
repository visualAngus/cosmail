<?php
    $id_player = $_POST['id_player'];
    $id_partie = $_POST['id_partie'];
    $txt = $_POST['txt'];

    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour créer une partie
    $stmt = $conn->prepare("INSERT INTO log_messages (id_player_link, id_partie_link, txt) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $id_player, $id_partie, $txt);
    $stmt->execute();
    $stmt->close();

    $sql = "UPDATE parties SET counter_modif = counter_modif + 1 WHERE id_partie = '$id_partie'";
    $result = mysqli_query($conn, $sql);


    mysqli_close($conn);
?>
