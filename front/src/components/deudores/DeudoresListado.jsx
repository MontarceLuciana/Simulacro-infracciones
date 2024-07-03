import React from "react";
import moment from "moment";

export default function DeudoresListado({
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
            <th className="text-center">Apellido y Nombre</th>
            <th className="text-center">Fecha Deuda</th>
            <th className="text-center">Importe Adeudado</th>
          </tr>
        </thead>
        <tbody>
          {Items && Items.length > 0 ? (
            Items.map((item) => (
              <tr key={item.IdDeudor}>
                <td>{item.ApellidoYNombre}</td>
                <td className="text-center">
                  {moment(item.FechaDeuda).format("DD/MM/YYYY")}
                </td>
                <td className="text-end">{item.ImporteAdeudado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
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
