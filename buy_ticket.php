<?php

require 'db_config.php';
header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $firstName = $data['firstName'] ?? '';
    $lastName = $data['lastName'] ?? '';
    $studentId = $data['studentId'] ?? null;
    $email = $data['email'] ?? '';
    $ticketType = $data['ticketType'] ?? '';
    $quantity = $data['quantity'] ?? 0;
    if (!empty($firstName) && !empty($lastName) && filter_var($email, FILTER_VALIDATE_EMAIL) && $quantity > 0) {
        $ticketTypeId = ($ticketType === 'student') ? 2 : 1;
        if ($ticketTypeId == 2 && (empty($studentId) || !ctype_digit($studentId) || strlen($studentId) != 6)) {
            echo json_encode(['success' => false, 'message' => 'Dla biletu studenckiego wymagany jest poprawny 6-cyfrowy numer indeksu.']);
            $conn->close();
            exit();
        }
        $stmt = $conn->prepare("INSERT INTO tickets (Name, Last_name, `Index`, Mail, Ticket_type, Number) VALUES (?, ?, ?, ?, ?, ?)");
        $index_to_insert = ($ticketTypeId == 2) ? $studentId : null;
        $stmt->bind_param("ssisii", $firstName, $lastName, $index_to_insert, $email, $ticketTypeId, $quantity);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Zakup zakończony pomyślnie! Potwierdzenie zostało wysłane na Twój adres e-mail.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Proszę wypełnić wszystkie wymagane pola poprawnie.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Nieprawidłowe żądanie.']);
}

$conn->close();
?>