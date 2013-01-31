<?php
   //Empty Array to hold all the recipes
   $Json = [];
   $UserID = //Your ID Here;
   $UserKey = //Your Yummly key;
   //This searches Yummly for cake recipes
   $Recipes = file_get_contents("http://api.yummly.com/v1/api/recipes?_app_id=" . $UserID . "&_app_key=" . $UserKey . "&maxResult=2&requirePictures=true&q=Cake");
   //Decode the JSON into a php object
   $Recipes = json_decode($Recipes)->matches;
   //Cycle Through The Recipes and Get full recipe for each
   foreach($Recipes as $Recipe)
   {
      $ID = $Recipe->id;
      $R = json_decode(file_get_contents("http://api.yummly.com/v1/api/recipe/" . $ID . "?_app_id=" . $UserID . "&_app_key=" . $UserKey . "&images=large"));
      //This is the data we are going to pass to our Template
      array_push($Json, array(
         Name => $R->name,
         Ingredients => $R->ingredientLines,
         Image => $R->images[0]->hostedLargeUrl,
         Yield => $R->yield,
         Flavors => $R->flavors,
         Source => array(
            Name => $R->source->sourceDisplayName,
            Url => $R->source->sourceRecipeUrl
         )
      ));
   }
   //Print out the final JSON object
   echo json_encode($Json);
?>