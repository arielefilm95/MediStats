export interface PatientRecord {
  id?: string;
  row?: number;
  fecha: string;
  profesional: string;
  fichaUsuario: string;
  rutUsuario: string;
  diagnostico: string;
  codigo: string;
  clasificacionPatologia: string;
  sexo: string;
  edad: string;
  mai: boolean;
  pensionado: boolean;
  noBeneficiario: boolean;
  atencionCerrada: boolean;
  atencionAbierta: boolean;
  atencionUrgencia: boolean;
  ingreso: boolean;
  pti: boolean;
  consultaInicial: boolean;
  consultaIntermedia: boolean;
  sesiones: number;
  
  // Procedures
  rehabilitacionAuditiva: boolean;         // Col 56
  audiometriaAdultos: boolean;             // Col 85
  audiometriaNinos: boolean;               // Col 86
  audiometriaCampoLibre: boolean;         // Col 87
  calibracionAudifonos: boolean;           // Col 88
  funcionTubaria: boolean;                 // Col 89
  emisionesOtoacusticas: boolean;          // Col 90
  rehabilitacionAuditiva3: boolean;        // Col 91
  potencialesEvocadosAuditivos: boolean;   // Col 92
  otoscopia: boolean;                      // Col 93
  rehabilitacionVestibular: boolean;       // Col 94
  rehabilitacionLecturaLabiofacial: boolean; // Col 95
  impendanciometria: boolean;              // Col 96
  pruebaDeAudifonos: boolean;              // Col 97
  testDeGlicerol: boolean;                 // Col 98
  pruebaCalorica: boolean;                 // Col 99
  examenFuncionalVIIIPar: boolean;         // Col 100
  estudioFuncionalEquilibrio: boolean;     // Col 101
  timpanometriaBandaAncha: boolean;        // Col 102
  habituacionVestibular: boolean;          // Col 103
  maniobraReposicionParticulas: boolean;   // Col 104
  maniobrasReposicionVestibular: boolean;  // Col 105
  alta: boolean;                           // Col 192
}

export interface ExtractedData {
  fichaUsuario?: string;
  rutUsuario?: string;
  nombre?: string;
  diagnostico?: string;
  edad?: string;
  sexo?: string;
}
