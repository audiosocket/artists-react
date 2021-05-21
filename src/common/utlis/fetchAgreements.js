import React from "react";
import {ACCESS_TOKEN, AGREEMENTS, BASE_URL} from "../api";

async function fetchAgreements() {
  const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
  const response = await fetch(`${BASE_URL}${AGREEMENTS}`,
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
export default fetchAgreements;
