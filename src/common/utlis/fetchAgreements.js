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
  if (response.status !== 200) {
    return [];
  } else {
    return resultSet;
  }
  /*return new Promise<>(async () => {
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");

    const response = await fetch(`${BASE_URL}${AGREEMENTS}`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        }
      });
    if (!response.ok) {
      return []
    } else {
      const data = await response.json();
      return data
    }
  });*/

}
export default fetchAgreements;
