import React from "react";
import {ACCESS_TOKEN, BASE_URL, LIST_COLLABORATORS} from "../api";

async function fetchCollaborators() {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${LIST_COLLABORATORS}`,
    {
      headers: {
        "authorization": ACCESS_TOKEN,
        "auth-token": userAuthToken
      }
    });
  const resultSet = await response.json();
  if (!response.ok) {
    return null;
  } else {
    return resultSet;
  }
}
export default fetchCollaborators;
