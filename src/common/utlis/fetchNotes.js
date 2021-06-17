import React from "react";
import {ACCESS_TOKEN, BASE_URL, NOTES} from "../api";

async function fetchNotes(type =  'ArtistProfile') {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${NOTES}?notable_type=${type}`,
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
    return resultSet;
  }
}
export default fetchNotes;
