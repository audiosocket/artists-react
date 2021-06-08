import React from "react";
import {ACCESS_TOKEN, BASE_URL, ALBUMS} from "../api";

async function fetchAlbums() {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${ALBUMS}?pagination=false`,
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
