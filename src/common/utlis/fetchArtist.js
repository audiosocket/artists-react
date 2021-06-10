import React from "react";
import {ACCESS_TOKEN, ARTIST_PROFILE_SHOW, BASE_URL} from "../api";

async function fetchArtist(artist_id = null) {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const url = artist_id ? `${BASE_URL}${ARTIST_PROFILE_SHOW}?artist_id=${artist_id}` : `${BASE_URL}${ARTIST_PROFILE_SHOW}`;
  const response = await fetch(url,
    {
      headers: {
        "authorization": ACCESS_TOKEN,
        "auth-token": userAuthToken
      }
    });
  const resultSet = await response.json();
  if (!response.ok) {
    return {};
  } else {
    return resultSet;
  }
}
export default fetchArtist;
