<?php
    $id = $_POST['id_player'];
    $id_partie = $_POST['id_partie']; 

    // Connexion à la base de données
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "SELECT joueurs_actifs.point, pawns.id_pawn, pawns.id_emplacement_link, pawns.etat, type_pawn.type_pawn_name, joueurs_actifs.nom,joueurs_actifs.point,joueurs_actifs.steep,player_color.color
            FROM joueurs_actifs 
            LEFT JOIN pawns ON joueurs_actifs.id_joueur = pawns.id_joueur_link
            LEFT JOIN type_pawn ON pawns.link_type_pawn = type_pawn.id_type_pawn
            LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
            WHERE id_joueur = '$id'";

    $result = mysqli_query($conn, $sql);

    $sql = "SELECT pawns.id_pawn, pawns.id_emplacement_link, pawns.etat, type_pawn.type_pawn_name, joueurs_actifs.id_joueur,type_pawn.type_pawn_name,player_color.color
            FROM parties 
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            LEFT JOIN pawns ON joueurs_actifs.id_joueur = pawns.id_joueur_link
            LEFT JOIN type_pawn ON pawns.link_type_pawn = type_pawn.id_type_pawn
            LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
            WHERE parties.id_partie = '$id_partie' AND joueurs_actifs.id_joueur != '$id' AND id_pawn IS NOT NULL"; ;
    $result2 = mysqli_query($conn, $sql);
    
    $sql = "SELECT chat.id_player_link, chat.chat, player_color.color, joueurs_actifs.nom, chat.id_chat
            FROM parties
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            LEFT JOIN chat ON joueurs_actifs.id_joueur = chat.id_player_link
            LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
            WHERE parties.id_partie = '$id_partie' AND chat.id_player_link IS NOT NULL";
    $result3 = mysqli_query($conn, $sql);



    $data2 = [];
    if (mysqli_num_rows($result2) > 0) {
        while ($row = mysqli_fetch_assoc($result2)) {
            $data2[] = $row;
        }
    } else {
        echo json_encode(["error" => "No results found"]);
    }

    $data3 = [];
    if (mysqli_num_rows($result3) > 0) {
        while ($row = mysqli_fetch_assoc($result3)) {
            $data3[] = $row;
        }
    } else {
        echo json_encode(["error" => "No results found"]);
    }

    $data = [];
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode(["player" => $data, "opponent" => $data2, "messages" => $data3]);
    } else {
        echo json_encode(["error" => "No results found"]);
    }

    mysqli_close($conn);
?>
