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
  const { legajo } = req.params

  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const alumno = alumnos.find((a) => a.legajo === Number(legajo))

    if (!alumno) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    return res.status(200).json(alumno)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudo obtener el detalle del alumno con legajo n° ${legajo}`
    })
  }
}

const postNewAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const nuevoLegajo =
      alumnos.length > 0
        ? Math.max(...alumnos.map((alumno) => alumno.legajo)) + 1
        : 1

    const nuevoAlumno = new AlumnoModel(nombre, apellido, email, nuevoLegajo)

    const { valido, errores } = AlumnoModel.validar(
      nuevoAlumno.getAllAttributes()
    )
    if (!valido) {
      return res.status(400).json({ errores })
    }

    const emailDuplicado = alumnos.some(
      (alumno) => alumno.email.toLowerCase() === email.toLowerCase()
    )
    if (emailDuplicado) {
      return res.status(409).json({
        msg: `Ya existe un alumno registrado con el email ${email}`
      })
    }

    const alumnoNuevo = nuevoAlumno.getAllAttributes()
    alumnos.push(alumnoNuevo)

    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    return res.status(201).json({
      msg: `Se agregó al sistema el alumno nuevo con el legajo n° ${nuevoLegajo}`,
      alumnoNuevo
    })
  } catch (error) {
    console.log(error)
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
      msg: 'Alumno actualizado correctamente',
      alumno: alumnos[index]
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'No se pudieron modificar los datos del alumno'
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
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo eliminar el alumno del sistema'
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
