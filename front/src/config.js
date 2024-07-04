const urlServidor = "http://localhost:4000"

const urlResourceArticulos = urlServidor + "/api/articulos";
const urlResourceArticulosFamilias = urlServidor + "/api/articulosfamilias";
const urlResourceDeudores = urlServidor + "/api/deudores";
const urlResourceInfracciones = urlServidor + "/api/infracciones";

export const config = {
    urlServidor,
    urlResourceArticulos,
    urlResourceArticulosFamilias,
    urlResourceDeudores,
    urlResourceInfracciones
}