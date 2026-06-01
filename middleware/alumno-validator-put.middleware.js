const validateInputAlumnoPut = (req, res, next) => {
  if (req.body.legajo) {
    return res.status(400).json({
      error: 'No se permite modificar el legajo'
    })
  }

  next()
}

module.exports = {
  validateInputAlumnoPut
}
