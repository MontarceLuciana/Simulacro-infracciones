import React from "react";
import moment from "moment";


export default function VerRegistro({
  Items,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-sm table-bordered table-striped">
        <thead>
          <tr>
            <th className="text-center">IdInfraccion</th>
            <th className="text-center">DNI</th>
            <th className="text-center">Fecha</th>
            <th className="text-center">Importe</th>
            <th className="text-center">Lugar</th>
          </tr>
        </thead>
        <tbody>
          {Items && Items.length > 0 ? (
            Items.map((Item) => (
              <tr key={Item.IdInfraccion}>
                <td>{Item.IdInfraccion}</td>
                <td>{Item.Dni}</td>
                <td className="text-center">
                  {moment(Item.Fecha).format("DD/MM/YYYY")}
                </td>
                <td className="text-end">{Item.Importe}</td>
                <td>{Item.Lugar}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="paginador">
        <div className="row">
          <div className="col">
            <span className="pyBadge">Registros: {RegistrosTotal}</span>
          </div>
          <div className="col text-center">
            Página:{" "}
            <select
              value={Pagina}
              onChange={(e) => {
                Buscar(e.target.value);
              }}
            >
              {Paginas?.map((x) => (
                <option value={x} key={x}>
                  {x}
                </option>
              ))}
            </select>{" "}
            de {Paginas?.length}
          </div>
        </div>
      </div>
    </div>
  );
}
