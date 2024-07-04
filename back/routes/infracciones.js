const express = require('express');
const { Op, ValidationError } = require("sequelize");
const router = express.Router();
const db = require("../base-orm/sequelize-init");

router.get("/api/infracciones", async function (req, res, next) {
  // #swagger.tags = ['Infracciones']
  // #swagger.summary = 'obtiene todos los Infracciones'
  // consulta de artículos con filtros y paginacion

  let where = {};
  if (req.query.IdInfraccion != undefined && req.query.IdInfraccion !== "") {
    where.IdInfraccion = {
      [Op.like]: "%" + req.query.IdInfraccion + "%",
    };
  }

  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 15;
  const { count, rows } = await db.infracciones.findAndCountAll({
    attributes: [
      "IdInfraccion",
      "Dni",
      "Fecha",
      "Importe",
      "Lugar",
    ],
    order: [["IdInfraccion", "ASC"]],
    where,
    offset: (Pagina - 1) * TamañoPagina,
    limit: TamañoPagina,
  });

  return res.json({ Items: rows, RegistrosTotal: count });
});

router.get("/api/infracciones/:id", async function (req, res, next) {
  // #swagger.tags = ['Infracciones']
  // #swagger.summary = 'obtiene una infraccion'
  // #swagger.parameters['id'] = { description: 'identificador del Articulo...' }
  let items = await db.infracciones.findOne({
    attributes: [
      "IdInfraccion",
      "Dni",
      "Fecha",
      "Importe",
      "Lugar",
    ],
    where: { IdInfraccion: req.params.id },
  });
  res.json(items);
});

router.post("/api/infracciones/", async (req, res) => {
  // #swagger.tags = ['Infracciones']
  // #swagger.summary = 'agrega una infraccion'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Infraccion',
                schema: { $ref: '#/definitions/Infracciones' }
    } */
  try {
    let data = await db.infracciones.create({
      Dni: req.body.Dni,
      Fecha: req.body.Fecha,
      Importe: req.body.Importe,
      Lugar: req.body.Lugar,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.put("/api/infracciones/:id", async (req, res) => {
  // #swagger.tags = ['Infracciones']
  // #swagger.summary = 'actualiza una infraccion'
  // #swagger.parameters['id'] = { description: 'identificador de la Infraccion...' }
  /*    #swagger.parameters['Infraccion'] = {
                in: 'body',
                description: 'Infraccion a actualizar',
                schema: { $ref: '#/definitions/Infracciones' }
    } */

  try {
    let item = await db.infracciones.findOne({
      attributes: [
        "IdInfraccion",
        "Dni",
        "Fecha",
        "Importe",
        "Lugar",
      ],
      where: { IdInfraccion: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Infraccion no encontrada" });
      return;
    }
    item.Dni = req.body.Dni;
    item.Fecha = req.body.Fecha;
    item.Importe= req.body.Importe;
    item.Lugar = req.body.Lugar;
    await item.save();

    // otra forma de hacerlo
    // let data = await db.infracciones.update(
    //   {
    //     Nombre: req.body.Nombre,
    //     Precio: req.body.Precio,
    //     CodigoDeBarra: req.body.CodigoDeBarra,
    //     IdArticuloFamilia: req.body.IdArticuloFamilia,
    //     Stock: req.body.Stock,
    //     FechaAlta: req.body.FechaAlta,
    //     Activo: req.body.Activo,
    //   },
    //   { where: { IdArticulo: req.params.id } }
    // );
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.delete("/api/infracciones/:id", async (req, res) => {
  // #swagger.tags = ['infracciones']
  // #swagger.summary = 'elimina una Infraccion'
  // #swagger.parameters['id'] = { description: 'identificador de la Infraccion..' }

  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.infracciones.destroy({
      where: { IdInfraccion: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE infracciones SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdInfraccion= :IdInfraccion",
        {
          replacements: { IdInfraccion: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});

module.exports = router;