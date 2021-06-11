import React from "react";
import {ACCESS_TOKEN, BASE_URL, PUBLISHERS, COLLABORATOR_PUBLISHERS} from "../api";

async function fetchPublishers(artist_id = null) {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const url = artist_id ? `${BASE_URL}${COLLABORATOR_PUBLISHERS}?pagination=false&artist_id=${artist_id}` : `${BASE_URL}${PUBLISHERS}?pagination=false`;
  const response = await fetch(url,
    {
      headers: {
        "authorization": ACCESS_TOKEN,
        "auth-token": userAuthToken
      }
    });
  const resultSet = await response.json();
  if (!response.ok) {
    return [];
  } else {
    return resultSet["publishers"];
  }
}
export default fetchPublishers;
