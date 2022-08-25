export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhcHBfaWQiOiJhcnRpc3RzLXBvcnRhbC1iYWNrZW5kIn0.9kL4HmyjCYJgdpBHX1g3JHAp235eKlLAO_vcPb4bYGk";
export const BASE_URL = "https://artists_backend.audiosocket.com/";
export const SESSION = "api/v1/session";
export const AUTHENTICATE_TOKEN = "api/v1/users/authenticate_token";
export const AUTHENTICATE_COLLABORATOR_TOKEN = "api/v1/artists_collaborators/authenticate_token";
export const ACCEPT_INVITATION = "api/v1/users/accept_invitation";
export const FORGOT_PASSWORD = "api/v1/users/forgot_password";
export const RESET_PASSWORD = "api/v1/users/reset_password";
export const WELCOME_CONTENT = "api/v1/content/Welcome";
export const AGREEMENTS = "api/v1/users_agreements";
export const ARTIST_PROFILE_SHOW = "api/v1/artists/show_profile";
export const ARTIST_PROFILE_UPDATE = "api/v1/artists/update_profile";
export const ALBUMS = "api/v1/albums";
export const PUBLISHERS = "api/v1/publishers";
export const INVITE_COLLABORATORS = "api/v1/artists/invite_collaborator";
export const LIST_COLLABORATORS = "api/v1/artists/collaborators";
export const ARTISTS_COLLABORATORS = "api/v1/artists_collaborators";
export const LIST_ARTISTS = "api/v1/artists";
export const NOTES = "api/v1/notes";
export const CREATE_TAX_FORM = "api/v1/tax_forms/create_tax_form";
export const LIST_GENRES = "api/v1/genres"
export const RESEND_INVITE_COLLABORATORS = "api/v1/artists/resend_collaborator_invitation";

export const COLLABORATOR_NOTES = "api/v1/collaborator/notes";
export const COLLABORATOR_ARTIST_PROFILE_SHOW = "api/v1/collaborator/artists/show_profile";
export const COLLABORATOR_ARTIST_PROFILE_UPDATE = "api/v1/collaborator/artists/update_profile";
export const COLLABORATOR_ALBUMS = "api/v1/collaborator/albums";
export const COLLABORATOR_PUBLISHERS = "api/v1/collaborator/publishers";
export const COLLABORATOR_LIST_COLLABORATORS = "api/v1/collaborator/artists/collaborators";
export const COLLABORATOR_INVITE_COLLABORATORS = "api/v1/collaborator/artists/invite_collaborator";
export const COLLABORATOR_ARTIST_COLLABORATORS = "api/v1/collaborator/artists_collaborators";
export const COLLABORATOR_CREATE_TAX_FORM = "api/v1/collaborator/tax_forms/create_tax_form";
export const RESEND_COLLABORATOR_INVITE_COLLABORATORS = "api/v1/collaborator/artists/resend_collaborator_invitation";

export const PRO_LIST = [
  {label: "Select PRO", value: null},
  {label: "NS (no society)", value: "NS"},
  {label: "Soundreef", value: "Soundreef"},
  {label: "USA - ASCAP", value: "USA - ASCAP"},
  {label: "USA - BMI", value: "USA - BMI"},
  {label: "USA - SESAC", value: "USA - SESAC"},
  {label: "United Kingdom - PRS", value: "United Kingdom - PRS"},
  {label: "Argentina - SADAIC", value: "Argentina - SADAIC"},
  {label: "Australia - APRA", value: "Australia - APRA"},
  {label: "Austria - AKM", value: "Austria - AKM"},
  {label: "Belgium - SABAM", value: "Belgium - SABAM"},
  {label: "Brazil - UBC", value: "Brazil - UBC"},
  {label: "Brazil - ECAD", value: "Brazil - ECAD"},
  {label: "Bulgaria - Musicautor", value: "Bulgaria - Musicautor"},
  {label: "Canada - SOCAN", value: "Canada - SOCAN"},
  {label: "Chile - SCD", value: "Chile - SCD"},
  {label: "Colombia - SAYCO", value: "Colombia - SAYCO"},
  {label: "Croatia - HDS", value: "Croatia - HDS"},
  {label: "Czech Republic - OSA", value: "Czech Republic - OSA"},
  {label: "Denmark - KODA", value: "Denmark - KODA"},
  {label: "Estonia - EAÜ", value: "Estonia - EAÜ"},
  {label: "Finland - TEOSTO", value: "Finland - TEOSTO"},
  {label: "France - SACEM", value: "France - SACEM"},
  {label: "Germany - GEMA", value: "Germany - GEMA"},
  {label: "Greece - AEPI", value: "Greece - AEPI"},
  {label: "Hong Kong - CASH", value: "Hong Kong - CASH"},
  {label: "Hungary - Artisjus", value: "Hungary - Artisjus"},
  {label: "Iceland - STEF", value: "Iceland - STEF"},
  {label: "India - IPRSO", value: "India - IPRS"},
  {label: "Ireland - IMRO", value: "Ireland - IMRO"},
  {label: "Israel - ACUM", value: "Israel - ACUM"},
  {label: "Italy - SIAE", value: "Italy - SIAE"},
  {label: "Japan - JASRAC", value: "Japan - JASRAC"},
  {label: "Lithuania - LATGA-A", value: "Lithuania - LATGA-A"},
  {label: "Malaysia - MACP", value: "Malaysia - MACP"},
  {label: "Mexico - SACM", value: "Mexico - SACM"},
  {label: "Netherlands - BUMA", value: "Netherlands - BUMA"},
  {label: "New Zealand - APRA", value: "New Zealand - APRA"},
  {label: "Norway -  TONO", value: "Norway -  TONO"},
  {label: "Poland - ZAIKS", value: "Poland - ZAIKS"},
  {label: "Portugal - SPA", value: "Portugal - SPA"},
  {label: "Russia - RAO", value: "Russia - RAO"},
  {label: "Singapore - COMPASS", value: "Singapore - COMPASS"},
  {label: "South Africa - SAMRO", value: "South Africa - SAMRO"},
  {label: "Spain - SGAE", value: "Spain - SGAE"},
  {label: "Sweden - STIM", value: "Sweden - STIM"},
  {label: "Switzerland - SUISA", value: "Switzerland - SUISA"},
  {label: "Trinidad & Tobago - COTT", value: "Trinidad & Tobago - COTT"},
  {label: "Turkey - MESAM", value: "Turkey - MESAM"},
  {label: "Uruguay - AGADU", value: "Uruguay - AGADU"},
  {label: "Other", value: 'other'} ];
