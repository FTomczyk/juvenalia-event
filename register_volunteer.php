<?php
require 'db_config.php';
header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $name_lastname = $data['name'] ?? '';
    $student_id = $data['student_id'] ?? '';
    $email = $data['email'] ?? '';
    if (!empty($name_lastname) && !empty($student_id) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $stmt = $conn->prepare("INSERT INTO wolontariat (Name_Last_name, `Index`, Mail) VALUES (?, ?, ?)");
        $stmt->bind_param("sis", $name_lastname, $student_id, $email);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Dziękujemy! Zostałeś pomyślnie zapisany jako wolontariusz.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Błąd serwera. Spróbuj ponownie później.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Wypełnij wszystkie pola poprawnie.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Nieprawidłowe żądanie.']);
}
$conn->close();
?>