const { PersonaModel } = require('../models/persona.model')
const { AlumnoModel } = require('../models/alumno.model')

describe('PersonaModel', () => {
  test('getters y setters de nombre, apellido y email', () => {
    const persona = new PersonaModel('Ana', 'Lopez', 'a@l.com')

    expect(persona.getNombre()).toBe('Ana')
    persona.setNombre('Bea')
    expect(persona.getNombre()).toBe('Bea')

    expect(persona.getApellido()).toBe('Lopez')
    persona.setApellido('Diaz')
    expect(persona.getApellido()).toBe('Diaz')

    expect(persona.getEmail()).toBe('a@l.com')
    persona.setEmail('b@d.com')
    expect(persona.getEmail()).toBe('b@d.com')
  })

  test('getNombreCompleto concatena nombre y apellido', () => {
    const persona = new PersonaModel('Ana', 'Lopez', 'a@l.com')
    expect(persona.getNombreCompleto()).toBe('Ana Lopez')
  })

  test('getAllAttributes devuelve el objeto plano', () => {
    const persona = new PersonaModel('Ana', 'Lopez', 'a@l.com')
    expect(persona.getAllAttributes()).toEqual({
      nombre: 'Ana',
      apellido: 'Lopez',
      email: 'a@l.com'
    })
  })
})

describe('AlumnoModel', () => {
  test('getters y setters propios', () => {
    const alumno = new AlumnoModel(
      'Ana',
      'Lopez',
      'a@l.com',
      5,
      '2026-01-01',
      '2026-01-01',
      true
    )

    expect(alumno.getLegajo()).toBe(5)

    expect(alumno.getIsActive()).toBe(true)
    alumno.setIsActive(false)
    expect(alumno.getIsActive()).toBe(false)

    expect(alumno.getModificacion()).toBe('2026-01-01')
    alumno.setModificacion('2026-02-02')
    expect(alumno.getModificacion()).toBe('2026-02-02')
  })

  test('hereda métodos de PersonaModel', () => {
    const alumno = new AlumnoModel('Ana', 'Lopez', 'a@l.com', 5)
    expect(alumno.getNombreCompleto()).toBe('Ana Lopez')
  })

  test('getAllAttributes incluye todos los campos del alumno', () => {
    const alumno = new AlumnoModel(
      'Ana',
      'Lopez',
      'a@l.com',
      5,
      '2026-01-01',
      '2026-01-01',
      false
    )
    expect(alumno.getAllAttributes()).toEqual({
      legajo: 5,
      nombre: 'Ana',
      apellido: 'Lopez',
      email: 'a@l.com',
      fechaAlta: '2026-01-01',
      modificacion: '2026-01-01',
      isActive: false
    })
  })

  test('usa valores por defecto para fechas e isActive', () => {
    const alumno = new AlumnoModel('Ana', 'Lopez', 'a@l.com', 9)
    const attrs = alumno.getAllAttributes()
    expect(attrs.fechaAlta).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(attrs.modificacion).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(attrs.isActive).toBe(true)
  })

  describe('validar', () => {
    test('devuelve valido=true con datos correctos', () => {
      const resultado = AlumnoModel.validar({
        legajo: 1,
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'a@l.com'
      })
      expect(resultado.valido).toBe(true)
      expect(resultado.errores).toHaveLength(0)
    })

    test('devuelve los errores con datos inválidos', () => {
      const resultado = AlumnoModel.validar({
        legajo: 'x',
        nombre: '',
        apellido: '',
        email: 'sin-arroba'
      })
      expect(resultado.valido).toBe(false)
      expect(resultado.errores.length).toBeGreaterThan(0)
    })
  })
})
