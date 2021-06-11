import React from "react";
import {ACCESS_TOKEN, BASE_URL, LIST_ARTISTS} from "../api";

async function fetchArtistsList() {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${LIST_ARTISTS}`,
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
    return resultSet["artists_collaborators"];
  }
}
export default fetchArtistsList;
