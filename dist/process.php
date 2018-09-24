<?php

include( $_SERVER['DOCUMENT_ROOT'] . '/connection.php' );

$post_contents = file_get_contents("php://input");

$post_vars = json_decode($post_contents, true);

$longURL = $post_vars["shareArgs"];
$shortURL = $post_vars["hash"];

$stmt = $conn->prepare("INSERT INTO URLs (shortURL, longURL) VALUES (?, ?)");

$stmt->bind_param('ss', $shortURL, $longURL);
// $stmt->execute();
     if ($stmt->execute()) {
      // header('Location: /index.php');
      echo 'CONNECTION PROCESSED';
      $stmt->close;
   } else {
      echo $conn->error;
  }
//  ?>