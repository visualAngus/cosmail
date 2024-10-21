<?php
    $id_partie = $_POST['id_partie'];
    $id_last_message = $_POST['id_last_message'];

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }


    $sql = "SELECT counter_modif FROM parties WHERE id_partie = '$id_partie'";
    $result = mysqli_query($conn, $sql);

    //recuperation du counter_modif unique
    $counter_modif = mysqli_fetch_assoc($result);
    $counter_modif = $counter_modif['counter_modif'];

    //get cookie
    $counter = $_COOKIE['counter'];

    // compare counter
    if($counter_modif == $counter){
        echo json_encode(["message" => "No modification"]);
        return;
    }else{
        $sql = "SELECT parties.etat, joueurs_actifs.id_joueur, joueurs_actifs.point, pawns.id_emplacement_link, pawns.etat,pawns.id_pawn
            FROM parties 
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            LEFT JOIN pawns ON joueurs_actifs.id_joueur = pawns.id_joueur_link
            WHERE parties.id_partie = '$id_partie' AND id_pawn IS NOT NULL";
        $result = mysqli_query($conn, $sql);

        $sql = "SELECT chat.id_player_link, chat.chat, player_color.color, joueurs_actifs.nom, chat.id_chat
            FROM parties
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            LEFT JOIN chat ON joueurs_actifs.id_joueur = chat.id_player_link
            LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
            WHERE parties.id_partie = '$id_partie' AND chat.id_chat > '$id_last_message' AND chat.id_player_link IS NOT NULL";
        $result2 = mysqli_query($conn, $sql);

        $data = [];
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            
        }
        $data2 = [];
        if (mysqli_num_rows($result2) > 0) {
            while ($row = mysqli_fetch_assoc($result2)) {
                $data2[] = $row;
            }
        }

        echo json_encode(["data" => $data, "data2" => $data2]);
        return;
    }

    mysqli_close($conn);
?>