import React from "react";
import { useForm } from "react-hook-form";

export default function Registro({
  AccionABMC,
  Item,
  Grabar,
  Volver,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isValid, isSubmitted },
  } = useForm({ defaultValues: Item });

  const onSubmit = (data) => {
    Grabar(data);
  };

  const handleVolver = () => {
    reset();
    Volver();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container-fluid">
        <fieldset disabled={AccionABMC === "C"}>

          {/* Campo DNI */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Dni">
                DNI <span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                {...register("Dni", {
                  required: { value: true, message: "DNI es requerido" },
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres",
                  },
                  maxLength: {
                    value: 8,
                    message: "Debe tener como máximo 8 caracteres",
                  },
                })}
                autoFocus
                className={
                  "form-control " + (errors?.Dni ? "is-invalid" : "")
                }
              />
              {errors?.Dni && touchedFields.Dni && (
                <div className="invalid-feedback">
                  {errors?.Dni?.message}
                </div>
              )}
            </div>
          </div>

          {/* Campo Fecha */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Fecha">
                Fecha<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="date"
                {...register("Fecha", {
                  required: { value: true, message: "Fecha es requerido" }
                })}
                className={
                  "form-control " + (errors?.Fecha ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">
                {errors?.Fecha?.message}
              </div>
            </div>
          </div>

          {/* Campo Importe */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Importe">
                Importe<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="number" step=".01"
                {...register("Importe", {
                  required: { value: true, message: "Importe es requerido" },
                  min: {
                    value: 0.01,
                    message: "Debe ser mayor a 0",
                  },
                  max: {
                    value: 999999.99,
                    message: "Debe ser menor o igual a 999999.99",
                  },
                })}
                className={
                  "form-control " + (errors?.Importe ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">{errors?.Importe?.message}</div>
            </div>
          </div>

          {/* Campo Lugar */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Lugar">
                Lugar <span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                {...register("Lugar", {
                  required: { value: true, message: "Lugar es requerido" },
                  minLength: {
                    value: 5,
                    message: "Debe tener al menos 5 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "Debe tener como máximo 100 caracteres",
                  },
                })}
                className={
                  "form-control " + (errors?.Lugar ? "is-invalid" : "")
                }
              />
              {errors?.Lugar && touchedFields.Lugar && (
                <div className="invalid-feedback">
                  {errors?.Lugar?.message}
                </div>
              )}
            </div>
          </div>

        </fieldset>

        {/* Botones Grabar, Cancelar/Volver */}
        <hr />
        <div className="row justify-content-center">
          <div className="col text-center botones">
            {AccionABMC !== "L" && (
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-check"></i> Registrar
              </button>
            )}
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleVolver}
            >
              <i className="fa fa-undo"></i>
              {AccionABMC === "C" ? " Volver" : "Limpiar"}
            </button>
          </div>
        </div>

        {/* Mensaje de validación */}
        {!isValid && isSubmitted && (
          <div className="row alert alert-danger mensajesAlert">
            <i className="fa fa-exclamation-sign"></i>
            Revisar los datos ingresados...
          </div>
        )}

      </div>
    </form>
  );
}
