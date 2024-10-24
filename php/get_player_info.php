<?php
    $id = $_POST['id_player'];
    $id_partie = $_POST['id_partie']; 

    // Connexion à la base de données
    include 'connexion.php';

    // Fonction pour récupérer les informations d'une partie donnée
    $sql = "SELECT joueurs_actifs.score, pawns.id_pawn, pawns.id_emplacement_link, pawns.etat, type_pawn.type_pawn_name, joueurs_actifs.nom,joueurs_actifs.steep,player_color.color,joueurs_actifs.numero_joueur
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

    $sql = "SELECT parties.etat, parties.tour_de_jeu as tour, joueurs_actifs.id_joueur, joueurs_actifs.nom
            FROM parties 
            LEFT JOIN joueurs_actifs ON parties.id_partie = joueurs_actifs.id_partie_link
            WHERE id_partie = '$id_partie' AND joueurs_actifs.id_partie_link = '$id_partie' AND joueurs_actifs.numero_joueur = parties.tour_de_jeu";
    $result4 = mysqli_query($conn, $sql);


    $sql = "SELECT log_messages.id_log_message, log_messages.txt, player_color.color
                FROM log_messages
                LEFT JOIN joueurs_actifs ON log_messages.id_player_link = joueurs_actifs.id_joueur
                LEFT JOIN player_color ON joueurs_actifs.numero_joueur = player_color.id_color
                WHERE log_messages.id_partie_link = '$id_partie' AND log_messages.id_log_message IS NOT NULL";

    $result5 = mysqli_query($conn, $sql);

    $data2 = [];
    if (mysqli_num_rows($result2) > 0) {
        while ($row = mysqli_fetch_assoc($result2)) {
            $data2[] = $row;
        }
    } 

    $data3 = [];
    if (mysqli_num_rows($result3) > 0) {
        while ($row = mysqli_fetch_assoc($result3)) {
            $data3[] = $row;
        }
    }

    $data4 = [];
    if (mysqli_num_rows($result4) > 0) {
        while ($row = mysqli_fetch_assoc($result4)) {
            $data4[] = $row;
        }
    }
    $data5 = [];
    if (mysqli_num_rows($result5) > 0) {
        while ($row = mysqli_fetch_assoc($result5)) {
            $data5[] = $row;
        }
    }


    $data = [];
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode(["player" => $data, "opponent" => $data2, "messages" => $data3, "game" => $data4,"log" => $data5]);
    } 

    mysqli_close($conn);
?>
