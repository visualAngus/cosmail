<?php
    $id = $_POST['id'];
    $id_partie = $_POST['id_partie'];

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "SELECT * FROM joueurs_actifs WHERE 	id_joueur = '$id' AND id_partie = '$id_partie'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "No results found"]);
    }

    mysqli_close($conn);
?>
