const request = require('supertest')

// Mockeamos fs para no leer ni escribir el archivo real data/alumnos.json
jest.mock('fs', () => {
  const actual = jest.requireActual('fs')
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: jest.fn(),
      writeFile: jest.fn()
    }
  }
})

const fs = require('fs')
const Server = require('../core/server')

const app = new Server().app

const seed = () => [
  {
    legajo: 10001,
    nombre: 'Mora',
    apellido: 'García',
    email: 'm.garcia@facultad.edu.ar',
    fechaAlta: '2026-03-02',
    modificacion: '2026-03-02',
    isActive: true
  },
  {
    legajo: 10002,
    nombre: 'Liam',
    apellido: 'Rodríguez',
    email: 'l.rodriguez@facultad.edu.ar',
    fechaAlta: '2026-03-02',
    modificacion: '2026-03-02',
    isActive: false
  }
]

beforeEach(() => {
  jest.clearAllMocks()
  fs.promises.readFile.mockResolvedValue(JSON.stringify(seed()))
  fs.promises.writeFile.mockResolvedValue(undefined)
})

describe('GET /alumnos', () => {
  test('200 devuelve la lista completa', async () => {
    const res = await request(app).get('/alumnos')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(2)
  })

  test('500 si falla la lectura del archivo', async () => {
    fs.promises.readFile.mockRejectedValueOnce(new Error('disco'))
    const res = await request(app).get('/alumnos')
    expect(res.status).toBe(500)
  })
})

describe('GET /alumnos/:legajo', () => {
  test('200 devuelve el alumno existente', async () => {
    const res = await request(app).get('/alumnos/10001')
    expect(res.status).toBe(200)
    expect(res.body.legajo).toBe(10001)
  })

  test('404 si el legajo no existe', async () => {
    const res = await request(app).get('/alumnos/99999')
    expect(res.status).toBe(404)
  })

  test('500 si falla la lectura del archivo', async () => {
    fs.promises.readFile.mockRejectedValueOnce(new Error('disco'))
    const res = await request(app).get('/alumnos/10001')
    expect(res.status).toBe(500)
  })
})

describe('POST /alumnos', () => {
  test('201 crea un alumno con legajo autogenerado', async () => {
    const res = await request(app)
      .post('/alumnos')
      .send({ nombre: 'Test', apellido: 'User', email: 't.user@facultad.edu.ar' })
    expect(res.status).toBe(201)
    expect(res.body.alumnoNuevo.legajo).toBe(10003)
    expect(fs.promises.writeFile).toHaveBeenCalled()
  })

  test('400 si el formato de los datos es inválido', async () => {
    const res = await request(app)
      .post('/alumnos')
      .send({ nombre: 123, email: 'no-es-un-email' })
    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.errores)).toBe(true)
  })

  test('400 si faltan campos obligatorios', async () => {
    const res = await request(app).post('/alumnos').send({})
    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.errores)).toBe(true)
  })

  test('409 si el email ya está registrado', async () => {
    const res = await request(app).post('/alumnos').send({
      nombre: 'Mora',
      apellido: 'García',
      email: 'm.garcia@facultad.edu.ar'
    })
    expect(res.status).toBe(409)
  })

  test('500 si falla la lectura del archivo', async () => {
    fs.promises.readFile.mockRejectedValueOnce(new Error('disco'))
    const res = await request(app)
      .post('/alumnos')
      .send({ nombre: 'Test', apellido: 'User', email: 't.user@facultad.edu.ar' })
    expect(res.status).toBe(500)
  })
})

describe('PUT /alumnos/:legajo', () => {
  test('200 actualiza todos los campos de un alumno existente', async () => {
    const res = await request(app)
      .put('/alumnos/10001')
      .send({
        nombre: 'Nuevo',
        apellido: 'Apellido',
        email: 'nuevo@facultad.edu.ar',
        isActive: false
      })
    expect(res.status).toBe(200)
    expect(res.body.alumno.nombre).toBe('Nuevo')
    expect(res.body.alumno.isActive).toBe(false)
    expect(fs.promises.writeFile).toHaveBeenCalled()
  })

  test('404 si el legajo no existe', async () => {
    const res = await request(app)
      .put('/alumnos/99999')
      .send({ nombre: 'X' })
    expect(res.status).toBe(404)
  })

  test('500 si falla la lectura del archivo', async () => {
    fs.promises.readFile.mockRejectedValueOnce(new Error('disco'))
    const res = await request(app)
      .put('/alumnos/10001')
      .send({ nombre: 'X' })
    expect(res.status).toBe(500)
  })
})

describe('DELETE /alumnos/:legajo', () => {
  test('200 elimina un alumno existente', async () => {
    const res = await request(app).delete('/alumnos/10001')
    expect(res.status).toBe(200)
    expect(res.body.alumno.legajo).toBe(10001)
    expect(fs.promises.writeFile).toHaveBeenCalled()
  })

  test('404 si el legajo no existe', async () => {
    const res = await request(app).delete('/alumnos/99999')
    expect(res.status).toBe(404)
  })

  test('500 si falla la lectura del archivo', async () => {
    fs.promises.readFile.mockRejectedValueOnce(new Error('disco'))
    const res = await request(app).delete('/alumnos/10001')
    expect(res.status).toBe(500)
  })
})

describe('Rutas no definidas', () => {
  test('404 en una ruta inexistente', async () => {
    const res = await request(app).get('/ruta-que-no-existe')
    expect(res.status).toBe(404)
    expect(res.body.msg).toBeDefined()
  })
})

describe('Server.listen', () => {
  test('inicia el servidor en el puerto configurado', () => {
    const servidor = new Server()
    const spy = jest
      .spyOn(servidor.app, 'listen')
      .mockImplementation((port, host, cb) => {
        cb()
        return { close: () => {} }
      })
    servidor.listen()
    expect(spy).toHaveBeenCalledWith(
      servidor.port,
      '0.0.0.0',
      expect.any(Function)
    )
  })
})
