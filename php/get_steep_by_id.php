<?php
// get_steep_by_id.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $rawData = file_get_contents("php://input");
    parse_str($rawData, $postData);

    // Decode the JSON encoded ids
    $ids = json_decode($postData['ids'], true);

    // Assuming you have a function to get steep by ids
    $conn = mysqli_connect("localhost", "root", "", "cosmail");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    $ids_ordered = implode(',', array_map('intval', $ids));
    $sql = "SELECT liaison.length, liaison.id_liaison , type_pawn.type_pawn_name as type
            FROM liaison 
            LEFT JOIN type_pawn ON liaison.type_transport = type_pawn.id_type_pawn
            WHERE id_liaison IN ($ids_ordered) ORDER BY FIELD(id_liaison, $ids_ordered)";
    $result = mysqli_query($conn, $sql);

    $data = [];
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "No results found"]);
    }


}
?>