import React from "react";
import {ACCESS_TOKEN, BASE_URL, COLLABORATOR_LIST_COLLABORATORS, LIST_COLLABORATORS} from "../api";

async function fetchCollaborators(artist_id = null) {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const url = artist_id ? `${BASE_URL}${COLLABORATOR_LIST_COLLABORATORS}?pagination=false&artist_id=${artist_id}` : `${BASE_URL}${LIST_COLLABORATORS}?pagination=false`
  const response = await fetch(url,
    {
      headers: {
        "authorization": ACCESS_TOKEN,
        "auth-token": userAuthToken
      }
    });
  const resultSet = await response.json();
  if (!response.ok) {
    if(resultSet["message"] === "Not accessible")
      return resultSet["message"];
    else
      return [];
  } else {
    return resultSet["artists_collaborators"];
  }
}
export default fetchCollaborators;
