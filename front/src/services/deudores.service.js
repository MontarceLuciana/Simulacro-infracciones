import httpService from "./http.service";
//const urlResource = "https://labsys.frc.utn.edu.ar/dds-express/api/articulos";

// mas adelante podemos usar un archivo de configuracion para el urlResource
import {config} from "../config";
 const urlResource = config.urlResourceDeudores;
 


async function Buscar(ApellidoYNombre, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { ApellidoYNombre,  Pagina },
  });
  return resp.data;
}


async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdDeudor);
  return resp.data;
}


async function Grabar(item) {
  if (item.IdDeudor === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdDeudor, item);
  }
}


export const deudoresService = {
  Buscar,BuscarPorId,Grabar
};