<?php 

// FOLLOW ALL REDIRECTS:
// This makes multiple requests, following each redirect until it reaches the
// final destination.

$reUrl = $_POST['reUrl'];



function get_redirect_final_target($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // follow redirects
    curl_setopt($ch, CURLOPT_AUTOREFERER, 1); // set referer on redirect
    curl_exec($ch);
    $target = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    curl_close($ch);

    if ($target)
        return json_encode(array('finalUrl' => $target, 'firstUrl' => $url));

    return false;
}

echo get_redirect_final_target($reUrl);

// function get_final_url($url){
//     $redirects = get_all_redirects($url);
//     if (count($redirects)>0){
//         return array_pop($redirects);
//     } else {
//         return $url;
//     }
// }
?>