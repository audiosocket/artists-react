import React from "react";
import {ACCESS_TOKEN, ARTIST_PROFILE_SHOW, BASE_URL} from "../api";

async function fetchArtist() {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${ARTIST_PROFILE_SHOW}`,
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
