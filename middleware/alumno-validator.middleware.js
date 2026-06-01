const validateInputAlumno = (req, res, next) => {
  const { nombre, apellido, email, isActive } = req.body || {}

  const errores = []

  // Validar nombre
  if (nombre !== undefined && typeof nombre !== 'string') {
    errores.push('El nombre debe ser un texto válido.')
  }

  // Validar apellido
  if (apellido !== undefined && typeof apellido !== 'string') {
    errores.push('El apellido debe ser un texto válido.')
  }

  // Validar email
  if (email !== undefined) {
    if (typeof email !== 'string') {
      errores.push('El email debe ser un texto válido.')
    }

    // regex simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      errores.push('El formato del email no es válido.')
    }
  }

  // Validar boolean
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errores.push('El campo isActive debe ser true o false.')
  }

  // errores encontrados
  if (errores.length > 0) {
    return res.status(400).json({
      errores
    })
  }

  next()
}

module.exports = {
  validateInputAlumno
}
