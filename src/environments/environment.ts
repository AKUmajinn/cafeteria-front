export const environment = {
  production: false,
  // TODAS las llamadas pasan por el API Gateway (puerto 8090),
  // nunca directo a los microservicios (8081/8082).
  apiUrl: 'http://localhost:8090/api'
};
