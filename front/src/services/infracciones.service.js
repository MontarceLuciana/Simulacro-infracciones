import httpService from "./http.service";
import { config } from "../config";

const urlResource = config.urlResourceInfracciones;

async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdInfraccion);
  return resp.data;
}

async function Grabar(item) {
  if (item.IdInfraccion === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdInfraccion, item);
  }
}

async function Buscar(IdInfraccion, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { IdInfraccion, Pagina },
  });
  return resp.data;
}

export const infraccionesService = {
  Buscar,
  BuscarPorId,
  Grabar,
};
