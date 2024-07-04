// acceder a la base usando aa-sqlite
const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  try {
    // abrir base, si no existe el archivo/base lo crea
    await db.open("./.data/pymes.db");

    let existe = false;
    let res = null;

    // Crear tabla usuarios si no existe
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'usuarios'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(
        "CREATE TABLE usuarios( IdUsuario INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT NOT NULL UNIQUE, Clave TEXT NOT NULL, Rol TEXT NOT NULL)"
      );
      console.log("Tabla usuarios creada!");
      await db.run(
        "INSERT INTO usuarios (Nombre, Clave, Rol) VALUES ('admin', '123', 'admin'), ('juan', '123', 'member')"
      );
    }

    // Crear tabla articulosfamilias si no existe
    existe = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'articulosfamilias'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(
        "CREATE TABLE articulosfamilias( IdArticuloFamilia INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT NOT NULL UNIQUE)"
      );
      console.log("Tabla articulosfamilias creada!");
      await db.run(
        "INSERT INTO articulosfamilias (Nombre) VALUES ('ACCESORIOS'), ('AUDIO'), ('CELULARES'), ('CUIDADO PERSONAL'), ('DVD'), ('FOTOGRAFIA'), ('FRIO-CALOR'), ('GPS'), ('INFORMATICA'), ('LED - LCD')"
      );
    }

    // Crear tabla articulos si no existe
    existe = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'articulos'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(`
        CREATE TABLE articulos( 
          IdArticulo INTEGER PRIMARY KEY AUTOINCREMENT,
          Nombre TEXT NOT NULL UNIQUE,
          Precio REAL,
          CodigoDeBarra TEXT,
          IdArticuloFamilia INTEGER,
          Stock INTEGER,
          FechaAlta TEXT,
          Activo BOOLEAN,
          FOREIGN KEY (IdArticuloFamilia) REFERENCES articulosfamilias(IdArticuloFamilia)
        );
      `);
      console.log("Tabla articulos creada!");

      await db.run(`
        INSERT INTO articulos (Nombre, Precio, CodigoDeBarra, IdArticuloFamilia, Stock, FechaAlta, Activo)
        VALUES
          ('KIT DIRECT TV PREPA 0.60MT', 299.00, '0779815559001', 10, 329, '2017-01-19', 1),
          ('KIT DIRECT TV PREPA 0.90MT', 349.00, '0779815559002', 10, 468, '2017-01-31', 1),
          ('LED 22" LG FHD 22MN42APM', 2669.00, '0779808338808', 10, 536, '2017-01-12', 1),
          ('LED 24" ILO HD DIGITAL MOD LDH24ILO02', 2999.00, '0779696260024', 10, 169, '2017-01-30', 1),
          ('LED 24" LG HD 24MN42A-PM', 3129.00, '0779808338809', 10, 296, '2016-12-28', 1),
          ('LED 32" BGH HD BLE3214D', 4830.00, '0779688540133', 10, 998, '2017-01-01', 1),
          ('LED 32" BGH SMART TV BLE3213RT', 5405.00, '0779688540117', 10, 650, '2017-01-18', 1),
          ('LED 32" HISENSE IPTV HLE3213RT', 5290.00, '0779688540119', 10, 51, '2017-02-03', 1),
          ('LED 32" HITACHI HD CDHLE32FD10', 4837.00, '0779694109973', 10, 838, '2016-12-25', 1);
      `);
    }

    // Crear tabla deudores si no existe
    existe = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'deudores'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(`
        CREATE TABLE deudores (
          IdDeudor INTEGER PRIMARY KEY AUTOINCREMENT,
          ApellidoYNombre TEXT NOT NULL,
          FechaDeuda DATE NOT NULL,
          ImporteAdeudado REAL NOT NULL
        );
      `);
      console.log("Tabla deudores creada!");

      await db.run(`
        INSERT INTO deudores (ApellidoYNombre, FechaDeuda, ImporteAdeudado)
        VALUES
          ('García Pérez', '2023-05-01', 15000),
          ('Rodríguez Martínez', '2023-04-15', 275000),
          ('Fernández Gómez', '2023-03-20', 87005),
          ('López Torres', '2023-05-10', 320000),
          ('Sánchez Ramírez', '2023-04-05', 1100000),
          ('Díaz Hernández', '2023-03-25', 625000),
          ('González Flores', '2023-05-15', 40500),
          ('Morales Castillo', '2023-04-01', 185000),
          ('Jiménez Guzmán', '2023-03-10', 375854),
          ('Ruiz Vargas', '2023-05-20', 290088);
      `);
    }

    // Crear tabla infracciones si no existe
    existe = false;
    res = await db.get(
      "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'infracciones'",
      []
    );
    if (res.contar > 0) existe = true;
    if (!existe) {
      await db.run(`
        CREATE TABLE infracciones (
          IdInfraccion INTEGER PRIMARY KEY AUTOINCREMENT,
          Dni TEXT NOT NULL,
          Fecha DATE NOT NULL,
          Importe REAL NOT NULL,
          Lugar TEXT NOT NULL
        );
      `);
      console.log("Tabla infracciones creada!");

      await db.run(`
        INSERT INTO infracciones (IdInfraccion,Dni, Fecha, Importe, Lugar)
        VALUES
          ('1','43692993', '2023-05-01', 15000, 'Lugar1'),
          ('2','44589556', '2023-04-15', 275000, 'Lugar2'),
          ('3','18018592', '2023-03-20', 87005, 'Lugar3'),
          ('4','13056328', '2023-05-10', 320000, 'Lugar4'),
          ('5','47123753', '2023-04-05', 1100000, 'Lugar5'),
          ('6','36745159', '2023-03-25', 625000, 'Lugar6'),
          ('7','44222486', '2023-05-15', 40500, 'Lugar7'),
          ('8','41719381', '2023-04-01', 185000, 'Lugar8'),
          ('9','38667998', '2023-03-10', 375854, 'Lugar9'),
          ('10','32422111', '2023-05-20', 290088, 'Lugar10');
      `);
    }

    // cerrar la base
    await db.close();
    console.log("Base de datos cerrada correctamente.");
  } catch (error) {
    console.error("Error al crear la base de datos:", error);
  }
}

// Llamar a la función para crear la base de datos si no existe
CrearBaseSiNoExiste();

// Exportar la función si es necesario
module.exports = CrearBaseSiNoExiste;
