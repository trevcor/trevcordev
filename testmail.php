<?php
$efrom = "From: tfcorcor@gmail.com\r\n";
mail(
'tfcorcor@gmail.com', // your email address
'Testing', // email subject
'This is an email sent from MAMP', // email body
$efrom . "\r\n"// additional headers
);
?>