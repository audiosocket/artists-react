import React from "react";
import {ACCESS_TOKEN, BASE_URL, COLLABORATOR_NOTES, NOTES} from "../api";

async function fetchNotes(type =  'ArtistProfile', id = null, role = 'artist', artist_id = null) {
  let url = `${BASE_URL}${NOTES}?notable_type=${type}&notable_id=${id}`;
  if(role === "collaborator")
    url = `${BASE_URL}${COLLABORATOR_NOTES}?notable_type=${type}&notable_id=${id}&artist_id=${artist_id}`;
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
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
    return resultSet;
  }
}
export default fetchNotes;
