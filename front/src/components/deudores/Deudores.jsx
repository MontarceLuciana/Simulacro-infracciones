import React, { useState, useEffect } from "react";
//import DeudoresBuscar from "../deudores/DeudoresBuscar"; NO lo usamos
import DeudoresListado from "../deudores/DeudoresListado";
import RegistroDeudores from "../deudores/RegistroDeudores";
import { deudoresService } from "../../services/deudores.service";
import modalDialogService from "../../services/modalDialog.service";


function Deudores() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    L: "(Listado)",
  };

  const [AccionABMC, setAccionABMC] = useState("L");
  const [ApellidoYNombre, setApellidoYNombre] = useState("");
  const [Items, setItems] = useState(null);
  const [Item, setItem] = useState(null); // used in BuscarPorId (Modificar, Consultar)
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
      const data = await deudoresService.Buscar(ApellidoYNombre, _pagina);
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

  async function BuscarPorIdAsync(item, accionABMC) {
    const data = await deudoresService.BuscarPorId(item);
    setItem(data);
    setAccionABMC(accionABMC);
  }


  async function Agregar() {
    setAccionABMC("A");
    setItem({
      IdDeudor: 0,
      ApellidoYNombre: "",
      ImporteAdeudado: "",
      FechaDeuda: "",
    });
  }

  async function Grabar(item) {
    try {
      await deudoresService.Grabar(item);
      await Buscar();
      Volver();
      modalDialogService.Alert(
        `Registro ${AccionABMC === "A" ? "agregado" : "modificado"} correctamente.`
      );
    } catch (error) {
      modalDialogService.Alert(
        error?.response?.data?.message ?? error.toString()
      );
    }
  }

  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Componente Deudores <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {/* esto no nos sirve porque no buscamos nada */}
      {/*AccionABMC === "L" && (
        <DeudoresBuscar
          ApellidoYNombre={ApellidoYNombre}
          setApellidoYNombre={setApellidoYNombre}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )*/}

{/*borrar linea 109 a 149 los forms no se definen aqui, sino en DeudoresBuscar.jsx en general
pero como la consigna no dice tener un componente DeudoresBuscar lo hacemos aca */}

    <form>

      {/* acá antes estaba la barra de búsqueda */}

      {/* Botones */}
      <div className="row">
        <div className="col text-center botones">
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => Buscar(1)}
          >
            {/* acá cambie buscar por listar todo, ambos hacen la función básica de listar */}

            <i className="fa fa-search"></i> Listar Todo
          </button>
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => Agregar()}
          >
            <i className="fa fa-plus"></i> Agregar
          </button>
        </div>
      </div>
    </form>
  

      
      {/* Tabla de resultados de búsqueda y Paginador */}
      {AccionABMC === "L" && Items?.length > 0 && (
        <DeudoresListado
          Items={Items}
          Pagina={Pagina}
          RegistrosTotal={RegistrosTotal}
          Paginas={Paginas}
          Buscar={Buscar}
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
        <RegistroDeudores
          AccionABMC={AccionABMC}
          Item={Item}
          Grabar={Grabar}
          Volver={Volver}
        />
      )}
    </div>
  );
}

export { Deudores };
