<?php
    $nb_joueur = $_POST['nb_joueurs'];
    $code = $_POST['code'];

    $token = bin2hex(random_bytes(16));

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }


    // Fonction pour créer une partie
    function creer_partie($conn, $nb_joueur, $code, $token) {
        $sql = "INSERT INTO parties (nb_joueur, code, token) VALUES ('$nb_joueur', '$code', '$token')";
        $result = mysqli_query($conn, $sql);
    }

    creer_partie($conn, $nb_joueur, $code, $token);

    // Fonction pour récupérer l'id de la partie créée
    $sql = "SELECT id_partie FROM parties WHERE code = '$code'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "No results found"]);
    }

    mysqli_close($conn);
?>
