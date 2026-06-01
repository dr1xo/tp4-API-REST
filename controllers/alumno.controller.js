const fs = require('fs').promises
const { AlumnoModel } = require('../models/alumno.model')

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    return res.status(200).json(alumnos)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se puedieron obtener los datos de los alumnos' })
  }
}

const getAlumnoById = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const { legajo } = req.params

    const legajoId = alumnos.find(
      (a) => a.legajo /* .toString() */ === Number(legajo)
    )

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    return res.status(200).json(legajoId)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo obtener el datalle del alumno con legajo n° {legajo}'
    })
  }
}

const postNewAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    console.log('Se parseó la infomración a "alumnos"')

    const legajos = alumnos.map((alumno) => alumno.legajo)
    const nuevoLejago = Math.max(...legajos) + 1
    console.log(`Nuevo legajo generado: ${nuevoLejago}`)

    const nuevoAlumno = new AlumnoModel(nombre, apellido, email, nuevoLejago)

    console.log(nuevoAlumno)
    const alumnoNuevo = nuevoAlumno.getAllAttributes()
    alumnos.push(alumnoNuevo)
    console.log(nuevoAlumno.getAllAttributes())

      await fs.writeFile(
    './data/alumnos.json',
    JSON.stringify(alumnos, null, 2),
    'utf8'
)

    return res.status(201).json({
      msg: `Se agregó al sistema el alumno nuevo con el legajo n° ${nuevoLejago}`,
      alumnoNuevo
    })
  } catch (error) {
    return res.status(500).json({
      error: 'No se pudo dar de alta el alumno'
    })
  }
}

const putAlumnoBylegajo = async (req, res) => {
  try {
    const { legajo } = req.params
    const { nombre, apellido, email, isActive } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const index = alumnos.findIndex(
      (alumno) => alumno.legajo === Number(legajo)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: `No se encontró el alumno con el legajo n° ${legajo}`
      })
    }

    // modificar directamente el objeto
    if (nombre) alumnos[index].nombre = nombre
    if (apellido) alumnos[index].apellido = apellido
    if (email) alumnos[index].email = email

    // importante para booleanos
    if (typeof isActive === 'boolean') {
      alumnos[index].isActive = isActive
    }

    alumnos[index].modificacion =
      new Date().toISOString().split('T')[0]

    // guardar array completo
    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    return res.status(200).json({
      msg: `Alumno actualizado correctamente`,
      alumno: alumnos[index]
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: `No se pudieron modificar los datos del alumno`
    })
  }
}

const deleteAlumnoByLegajo = async (req, res) => {
  try {
    const { legajo } = req.params

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const index = alumnos.findIndex(
      (alumno) => alumno.legajo === Number(legajo)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: `No se encontró el alumno con el legajo n° ${legajo}`
      })
    }

    const alumnoEncontrado = alumnos[index]

    alumnos.splice(index, 1)

    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    return res.status(200).json({
      msg: `Se eliminó correctamente el alumno con el legajo n° ${alumnoEncontrado.legajo}`,
      alumno: alumnoEncontrado
    })
  } catch (error) {
    return res.status(500).json({
      err: console.log(error),
      error: 'No se puedo eliminar el alumno del sistema'
    })
  }
}

module.exports = {
  getAlumnoAll,
  getAlumnoById,
  postNewAlumno,
  putAlumnoBylegajo,
  deleteAlumnoByLegajo
}
