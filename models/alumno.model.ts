import { PersonaModel } from './persona.model'

export class AlumnoModel extends PersonaModel {
  private legajo: number
  private fechaAlta: string
  private modificacion: string
  private isActive: boolean

  constructor(
    nombre: string,
    apellido: string,
    email: string,
    legajo: number,
    fechaAlta: string = new Date().toISOString().split('T')[0],
    modificacion: string = new Date().toISOString().split('T')[0],
    isActive: boolean = true
  ) {
    super(nombre, apellido, email)
    this.legajo = legajo
    this.fechaAlta = fechaAlta
    this.modificacion = modificacion
    this.isActive = isActive
  }

  // Getters y Setters
  public getLegajo(): number {
    return this.legajo
  }

  public getIsActive(): boolean {
    return this.isActive
  }
  public setIsActive(status: boolean): void {
    this.isActive = status
  }

  public getModificacion(): string {
    return this.modificacion
  }
  public setModificacion(fecha: string): void {
    this.modificacion = fecha
  }

  // Validar datos
  static validar(data: any): { valido: boolean; errores: string[] } {
    const errores: string[] = []

    if (!data.legajo || typeof data.legajo !== 'number') {
      errores.push('Legajo inválido')
    }
    if (!data.nombre || typeof data.nombre !== 'string') {
      errores.push('Nombre inválido')
    }
    if (!data.apellido || typeof data.apellido !== 'string') {
      errores.push('Apellido inválido')
    }
    if (!data.email || !data.email.includes('@')) {
      errores.push('Email inválido')
    }

    return {
      valido: errores.length === 0,
      errores
    }
  }

  // Polimorfismo
  public override getAllAttributes(): {
    legajo: number
    nombre: string
    apellido: string
    email: string
    fechaAlta: string
    modificacion: string
    isActive: boolean
  } {
    return {
      legajo: this.legajo,
      nombre: this.nombre, // Disponibles porque son 'protected' en PersonaModel
      apellido: this.apellido,
      email: this.email,
      fechaAlta: this.fechaAlta,
      modificacion: this.modificacion,
      isActive: this.isActive
    }
  }
}
