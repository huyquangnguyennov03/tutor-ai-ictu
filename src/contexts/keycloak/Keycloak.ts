import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: `${import.meta.env.VITE_KEYCLOAK_URL}`, // URL của Keycloak
  realm: `${import.meta.env.VITE_KEYCLOAK_REALM}`, // Tên realm
  clientId: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`, // Client ID trong Keycloak,
});

export default keycloak;
