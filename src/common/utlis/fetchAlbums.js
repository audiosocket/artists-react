import React from "react";
import {ACCESS_TOKEN, BASE_URL, ALBUMS, COLLABORATOR_ALBUMS} from "../api";

async function fetchAlbums(artist_id = null) {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const url = artist_id ? `${BASE_URL}${COLLABORATOR_ALBUMS}?pagination=false&artist_id=${artist_id}` : `${BASE_URL}${ALBUMS}?pagination=false`;
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
    return resultSet["albums"];
  }
}
export default fetchAlbums;
