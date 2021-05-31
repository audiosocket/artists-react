import React from "react";
import {ACCESS_TOKEN, BASE_URL, PUBLISHERS} from "../api";

async function fetchPublishers() {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${PUBLISHERS}`,
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
export default fetchPublishers;
