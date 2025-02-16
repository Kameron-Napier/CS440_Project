<?php
// establish connection to database
$conn = new mysqli("localhost", "root", "", "CS440");

// check if connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// check for POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $event_name = $_POST["event_name"];
    $event_day = $_POST["event_day"];
    $event_start_time = $_POST["event_start_time"];
    $event_end_time = $_POST["event_end_time"];

    // Check for overlapping events
    $check_query = "SELECT * FROM events_schedule WHERE event_day='$event_day' AND (
        ('$event_start_time' >= event_time AND '$event_start_time' < ADDTIME(event_time, '01:00:00')) OR
        ('$event_end_time' > event_time AND '$event_end_time' <= ADDTIME(event_time, '01:00:00')) OR
        ('$event_start_time' <= event_time AND '$event_end_time' >= ADDTIME(event_time, '01:00:00'))
    )";

    // check for conflicts
    $result = $conn->query($check_query);

    // return error if conflict else insert the event into the database
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Time conflict! This event overlaps with an existing event."]);
    } else {
        $query = "INSERT INTO events_schedule (event_name, event_day, event_time) VALUES ('$event_name', '$event_day', '$event_start_time')";
        // return success message if added return fail message if it doesn't
        if ($conn->query($query) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Event added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
        }
    }
}

// close connection to database
$conn->close();
?>
