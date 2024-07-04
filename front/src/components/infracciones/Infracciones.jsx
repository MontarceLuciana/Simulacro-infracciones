import React, { useState, useEffect } from "react";
import Registro from "../infracciones/Registro";
import VerRegistro from "../infracciones/VerRegistro";
import InfraccionesBuscar from "../infracciones/InfraccionesBuscar";
import { infraccionesService } from "../../services/infracciones.service";
import modalDialogService from "../../services/modalDialog.service";

function Infracciones() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    L: "(Listado)",
    C: "(Consultar)",
  };

  const [AccionABMC, setAccionABMC] = useState("L");
  const [IdInfraccion, setIdInfraccion] = useState("");
  const [Items, setItems] = useState(null); // Inicializado como un arreglo vacío
  const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
  const [RegistrosTotal, setRegistrosTotal] = useState(0);
  const [Pagina, setPagina] = useState(1);
  const [Paginas, setPaginas] = useState([]);
  
  async function Buscar(_pagina) {
    if (_pagina && _pagina !== Pagina) {
      setPagina(_pagina);
    } else {
      _pagina = Pagina;
    }
    modalDialogService.BloquearPantalla(true);
    try {
      const data = await infraccionesService.Buscar(IdInfraccion, _pagina);
      setItems(data.Items);
      setRegistrosTotal(data.RegistrosTotal);
      // Generate array of pages for pagination
      const arrPaginas = [];
      for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 15); i++) {
        arrPaginas.push(i);
      }
      setPaginas(arrPaginas);
    } finally {
      modalDialogService.BloquearPantalla(false);
    }
  }

  function Consultar(item) {
    BuscarPorId(item, "C"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }

  async function BuscarPorId(item, accionABMC) {
    const data = await infraccionesService.BuscarPorId(item);
    setItem(data);
    setAccionABMC(accionABMC);
  }

  async function Agregar() {
    setAccionABMC("A");
    setItem({
      IdInfraccion: 0,
      Dni: '',
      Fecha:'',
      Importe: '',
      Lugar: '',
    });
  }

  async function Grabar(item) {
    // agregar o modificar
    try
    {
      await infraccionesService.Grabar(item);
    }
    catch (error)
    {
      modalDialogService.Alert(error?.response?.data?.message ?? error.toString())
      return;
    }
    await Buscar();
    Volver();
  
    //setTimeout(() => {
      modalDialogService.Alert(
        "Registro " +
          (AccionABMC === "A" ? "agregado" : "modificado") +
          " correctamente."
      );
    //}, 0);
  }

  function Volver() {
    setAccionABMC("L");
  }

  function Limpiar() {
    try {
      setItem({
        Dni: "",
        Fecha: "",
        Importe: "",
        Lugar: "",
      });
    } catch (error) {
      modalDialogService.Alert(
        error?.response?.data?.message ?? error.toString()
      );
    }
  }

  return (
    <div>
      <div className="tituloPagina">
        Infracciones <small>{TituloAccionABMC[AccionABMC]}</small>
        </div>

        {AccionABMC === "L" && (
        <InfraccionesBuscar
          IdInfraccion={IdInfraccion}
          setIdInfraccion={setIdInfraccion}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}
          {/* Tabla de resultados de búsqueda y Paginador */}
          {Items?.length > 0 && (
            <VerRegistro
            {...{
              Items,
              Pagina,
              RegistrosTotal,
              Paginas,
              Buscar,
            }}
          />
          )}

      {AccionABMC === "L" && Items?.length === 0 && (
        <div className="alert alert-info mensajesAlert">
          <i className="fa fa-exclamation-sign"></i>
          No se encontraron registros...
        </div>
      )}

      {/* Formulario de alta/modificación/consulta */}
      {AccionABMC !== "L" && (
        <Registro
        {...{ AccionABMC, Item, Grabar, Volver, Limpiar }}
        />
      )}
    </div>
  );
}

export { Infracciones };

