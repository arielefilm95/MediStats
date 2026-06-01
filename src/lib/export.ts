import { PatientRecord } from '../types';

export const EXPORT_HEADERS = [
  'FECHA', 'PROFESIONAL', 'FICHA USUARIO', 'RUT USUARIO', 'DIAGNÓSTICO', 'CODIGO', 'Clasificación Patología ', 'SEXO', 'EDAD', 'MAI',
  'PENSIONADO', 'NO BENEFICIARIO', 'ATECIÓNCERRADA', 'ATENCIÓNABIERTA', 'ATENCIONDEURGENCIA', 'INGRESO', 'PTI', 'CONSULTAINICIAL', 'CONSULTA INTERMEDIA', 'SESIONES',
  'Evaluación de ayudas técnicas', 'Entrenamiento de ayudas técnicas', 'Fisioterapia', 'Tratamiento Compresivo', 'Atención Kinesiológica Integral', 'Entrenamiento Protésico', 'Educación Grupal', 'Educación Familiar', 'aspiración', 'Ejercicios Terapéuticos',
  'Evaluación de la Voz, habla y lenguaje.', 'Tratamientovoz habla y/o lenguaje', 'Tratamiento de funciones motoras orales', 'Estimulación Cognitiva', 'Prevención Deterioro OFA', 'Evaluación de deglución', 'Manejo trastorno de la deglución', 'Confección de óretesis y/o adapataciones', 'Habilitación y rehabiltación de AVD.', 'Habilitación y Rehabilitación laboral',
  'Habilitación y Rehabilitación educacional', 'Actividades Recreativas', 'Actividades Terapéuticas', 'Integración Sensorial', 'Psicoterapia Individual', 'MASOTERAPIA', 'ADAPTACIÓN DEL HOGAR', 'ORIENTACIÓN Y MOVILIDAD', 'ORIENTACIÓN SOCIOLABORAL', 'ORIENTACIÓN FAMILIAR Y A LA RED DE APOYO PARA EL TRABAJO',
  'GESTIÓN DE LA RED LOCAL PARA EL TRABAJO', 'TOMA DE MOLDE DE ÓRTESIS Y PRÓTESIS', 'PRUEBA DE ÓRTESIS Y PRÓTESIS', 'CONFECCIÓN DE ÓRTESIS Y PRÓTESIS', 'REPARACIÓN DE ÓRTESIS Y PRÓTESIS', 'REHABILITACIÓN AUDITIVA INDIVIDUAL', 'REHABILITACIÓN AUDITIVA GRUPAL', 'TERAPIA RESPIRATORIA Y FUNCIONAL PULMONAR', 'EDUCACIÓN INDIVIDUAL', 'Aplicación de Tape',
  'Educación grupal2', 'Consejería familiar Profesional salud.', 'Consejería Individual  profesional salud', 'Reentrenamiento de AVD', 'Evaluación y Rehabilitación en AVD', 'Evaluación de desarrollo Psicomotor', 'Evaluación independencia en AVD                     ', 'Evaluación Motriz Funcional', 'Rehabilitación de funciones cognitivas', 'Actividad Terapéutica',
  'Entrenamiento Funcional con ATO', 'Evaluación para entrega de ATO', 'Entrega de ATO', 'Entrenamiento Protésico extremidades', 'Reeducación Motriz', 'Técnicas de relajación', 'Entrenamiento ortésico del gran incapacitado', 'Técnicas facilitación-Téc. Inhibiciún', 'Masoterapia2', 'Integración Sensorial2',
  'Estimulación cognitiva grupal', 'Estimulación Cognitiva ', 'EVALUACIÓN IVADEC', 'Evaluación Cognitiva', 'Audiometría en Adultos', 'Audiometría en niños', 'Audiometría de campo libre', 'Calibración de Audífonos', 'Función tubaria', 'Emisiones otoacústicas',
  'REHABILITACIÓN AUDITIVA INDIVIDUAL3', 'Potenciales Evocados Auditivos', 'Otoscopía', 'Rehabilitación vestibular', 'Rehabilitación Lectura LabioFacial', 'Impendanciometría            ', 'Prueba de audifonos     ', 'Test de glicerol', 'Prueba calórica     ', 'Examen funcional de VIII Par                                     ',
  'Estudio funcional de equilibrio en plataforma', 'Timpanometría de banda ancha', 'Habituación Vestibular', 'Maniobra de reposción de partículas', 'Maniobras de reposición vestibular', 'Evaluación de voz', 'Evaluación de lenguaje', 'Evaluación de habla', 'Evaluación de la deglución', 'Evaluación de funciones cognitivas',
  'Rehabilitación de la Voz', 'Rehabilitación del habla', 'Rehabilitación del Lenguaje', 'Manejo de trastorno de la deglución', 'Prevención de Deterioro de OFA', 'Terapia de rh de la voz en pcte laringectomizado', 'Rehabilitación de la voz                            ', 'Rehabilitación de la habla y/o lenguaje                ', 'Electroestimulación en Disfagia', 'Rehabilitación de la deglución',
  'Rehabilitación Trastorno Cognitivo-Comunicativo', 'Reactivación de órganos fonoartriculatorios.', 'Ejercicios  respiratorios y procedimientos de KNT Torácica.', 'Drenajes Postulares bron.                             ', 'Evaluación Respiratoria', 'Maniobras de Permebealización V.A', 'Técnicas de Flujos', 'Técnicas de Ventilación', 'Drenaje postural', 'Succión de Secreción',
  'Reeducación de la tos y respiración en pctes con TQT', 'Asistencia en IOT, VMNI,cambio de cánula de TQT', 'Aerosol Terapia', 'Toma muestra secreciones          ', 'Ventilación  MNI ', 'Oxigeno Terapia', 'Saturometría', 'Estimulación de la tos', 'Toma de BK', 'Téc. Reed. Neuromotoras',
  'Aplicación de MTB ', 'Estimulación Electrica', 'Neurodinamia', 'Turbión                                                    ', 'Onda Corta (ultratermia)                  ', 'Ultrasonido                                            ', 'Analgesia Transcutanea (tens)       ', 'Retroalimentación neuromuscular (miofeedback)                   ', 'Compresión neumática (masaje compresivo)  ', 'Tracción cervical y/o lumbar (mecanica o manual)                                           ',
  'Atención kinesiológica Integral     ', 'Entrenamiento ergonometrico con treadmill o cicloergometro                             ', 'Ev. Kinesiológica  (muscular, articular, postural,neurológica)              ', 'Puncion Seca', 'TOMA DE MOLDE DE ÓRTESIS Y PRÓTESIS4', 'PRUEBA DE ÓRTESIS Y PRÓTESIS5', 'CONFECCIÓN DE ÓRTESIS Y PRÓTESIS6', 'REPARACIÓN DE ÓRTESIS Y PRÓTESIS7', 'CORREAS DESROTADORAS PARÁLIS BRAQUIAL OBSTÉTRICA', 'FÉRULA ABDUCCIÓN DE HOMBRO (COAPTADOR)',
  'CORREA DORSIFLEXIÓN PIE', 'TALONERA DE GOMA (PAR)', 'ORTESIS TOBILLO-PIE', 'ORTESIS MANO-MUÑECA PASIVA', 'ORTESIS PALMAR ACTIVA (UCLA)', 'ORTESIS PARA RODILLA', 'RODILLERA', 'ORTESIS MUSLO PIE O ISQUIOPEDIO', 'ORTESIS CORTA  DE POSICIÓN DIGITALES               ', 'ORTESIS USO NOCT. DE EEII               ',
  'ORTESIS LARGA DE POSICIÓN EESS       ', 'VACIA', 'CORREAS DESROTADORAS                       ', 'FERULA EXT. CODO                                   ', 'FERULA EXT. DE MUÑECA            ', 'FERULA FX MUÑECA                                ', 'PALMETA EXT. MUÑECA X DEDOS                  ', 'EV. FUNCIONAL', 'ERGOTERAPIA', 'EDUCACIÓN TPA - TCE',
  'CONTROL DE EDEMA', 'ELONGACIONES', 'APLICACIÓN DE TAPE2', 'MANEJO CICATRIZ C/ SILICONA', 'TALLERES GRUPALES', 'ESTIMULACIóN SENSORIAL', 'GESTIÓN DE LA RED LOCAL PARA EL TRABAJO8', 'ADAPTACIÓN AL HOGAR', 'ORIENTACIÓN IRND', 'POST. AT SENADIS',
  'EVALUACIÓN IVADEC2', 'ALTA', 'ABANDONO', 'FALLECIMIENTO', 'ACV DERIVADO A APS', 'Trabajo con Objetivos de habilitación y Rh.', 'Trabajo sin Objetivos de habilitación y Rh.', 'Dueña de casa', 'EDUCATIVA', 'COMUNITARIO',
  ' Obj. de habilitación y Rh prelaboral', ' FISICA', ' SENSORIAL AUDITIVO', 'RBC', 'A OTRO HOSPITAL  (hospitalizado)', 'A NIVEL SECUNDARIO', 'A NIVEL PRIMARIO', 'OBSERVACIONES', 'Columna2', 'Columna3',
  'condicion', 'EDAD2', 'EDAD3', 'profesion', 'calidad juridica', 'ERROR BENEFICIARIO', 'ERROR ATENCION', 'ERROR TIPO ATENCION'
];

const COL_MAPPING: Record<string, number> = {
  fecha: 1,
  profesional: 2,
  fichaUsuario: 3,
  rutUsuario: 4,
  diagnostico: 5,
  codigo: 6,
  clasificacionPatologia: 7,
  sexo: 8,
  edad: 9,
  mai: 10,
  pensionado: 11,
  noBeneficiario: 12,
  atencionCerrada: 13,
  atencionAbierta: 14,
  atencionUrgencia: 15,
  ingreso: 16,
  pti: 17,
  consultaInicial: 18,
  consultaIntermedia: 19,
  sesiones: 20,
  
  // Procedures
  rehabilitacionAuditiva: 56,
  audiometriaAdultos: 85,
  audiometriaNinos: 86,
  audiometriaCampoLibre: 87,
  calibracionAudifonos: 88,
  funcionTubaria: 89,
  emisionesOtoacusticas: 90,
  rehabilitacionAuditiva3: 91,
  potencialesEvocadosAuditivos: 92,
  otoscopia: 93,
  rehabilitacionVestibular: 94,
  rehabilitacionLecturaLabiofacial: 95,
  impendanciometria: 96,
  pruebaDeAudifonos: 97,
  testDeGlicerol: 98,
  pruebaCalorica: 99,
  examenFuncionalVIIIPar: 100,
  estudioFuncionalEquilibrio: 101,
  timpanometriaBandaAncha: 102,
  habituacionVestibular: 103,
  maniobraReposicionParticulas: 104,
  maniobrasReposicionVestibular: 105,
  alta: 192
};

export function exportToCSV(records: PatientRecord[], filename = 'estadistica_clinica.csv') {
  const delimiter = ';';

  // Map each record to a 218-element row
  const rows = records.map(r => {
    const rowData = new Array(218).fill('');

    // Pre-fill defaults for columns 2 and 6
    rowData[1] = r.profesional || 'ARIEL ESPINOZA'; // Col 2
    rowData[5] = r.codigo || '7'; // Col 6
    rowData[6] = '=VLOOKUP(Tabla1[[#This Row],[CODIGO]],DIMENSION!$H$1:$I$30,2,FALSE)'; // Col 7 (Clasificación)

    // Write mapped values
    Object.entries(COL_MAPPING).forEach(([key, colIndex]) => {
      const idx = colIndex - 1; // 0-based array index
      const val = (r as any)[key];

      if (val === undefined || val === null) {
        if (colIndex >= 21 && colIndex <= 200) {
          rowData[idx] = '0'; // Procedure columns default to 0 in spreadsheet
        }
        return;
      }

      if (typeof val === 'boolean') {
        if (colIndex >= 10 && colIndex <= 19) {
          // Admission/MAI columns are 1 or empty
          rowData[idx] = val ? '1' : '';
        } else if (colIndex >= 21 && colIndex <= 200) {
          // Procedure columns are 1 or 0
          rowData[idx] = val ? '1' : '0';
        } else {
          rowData[idx] = val ? '1' : '0';
        }
      } else {
        rowData[idx] = val.toString();
      }
    });

    // Formulas for columns 211 to 218 (which are columns 210 to 217 in 0-based indices)
    rowData[210] = '=IF(OR(Tabla1[[#This Row],[CODIGO]]<7,Tabla1[[#This Row],[CODIGO]]>8),"CONDICIÓN FÍSICA",IF(Tabla1[[#This Row],[CODIGO]]=7,"CONDICIóN SENSORIAL AUDITIVO","CONDICIóN SENSORIAL VISUAL"))'; // col 211
    rowData[211] = '=IF(Tabla1[[#This Row],[EDAD]]=0,"1",IF(Tabla1[[#This Row],[EDAD]]=1,"1",IF(Tabla1[[#This Row],[EDAD]]<5,"1",IF(Tabla1[[#This Row],[EDAD]]<10,"2",IF(Tabla1[[#This Row],[EDAD]]<15,"3",IF(Tabla1[[#This Row],[EDAD]]<20,"4",IF(Tabla1[[#This Row],[EDAD]]<25,"5",IF(Tabla1[[#This Row],[EDAD]]<30,"6",IF(Tabla1[[#This Row],[EDAD]]<35,"7",IF(Tabla1[[#This Row],[EDAD]]<40,"8",IF(Tabla1[[#This Row],[EDAD]]<45,"9",IF(Tabla1[[#This Row],[EDAD]]<50,"10",IF(Tabla1[[#This Row],[EDAD]]<55,"11",IF(Tabla1[[#This Row],[EDAD]]<60,"12",IF(Tabla1[[#This Row],[EDAD]]<65,"13",IF(Tabla1[[#This Row],[EDAD]]<70,"14", IF(Tabla1[[#This Row],[EDAD]]<75,"15",IF(Tabla1[[#This Row],[EDAD]]<80,"16","17"))))))))))))))))))'; // col 212
    rowData[212] = '=IF(Tabla1[[#This Row],[EDAD]]=0,"1",IF(Tabla1[[#This Row],[EDAD]]<5,"2",IF(Tabla1[[#This Row],[EDAD]]<10,"3",IF(Tabla1[[#This Row],[EDAD]]<20,"4",IF(Tabla1[[#This Row],[EDAD]]<65,"5",6)))))'; // col 213
    rowData[213] = '=VLOOKUP(Tabla1[[#This Row],[PROFESIONAL]],DIMENSION!$B:$D,2,FALSE)'; // col 214
    rowData[214] = '=VLOOKUP(Tabla1[[#This Row],[PROFESIONAL]],DIMENSION!$B:$D,3,FALSE)'; // col 215
    rowData[215] = '=IF(OR(SUM(Tabla1[[#This Row],[MAI]:[NO BENEFICIARIO]])=0,SUM(Tabla1[[#This Row],[MAI]:[NO BENEFICIARIO]])>1),"ERROR","OK")'; // col 216
    rowData[216] = '=IF(OR(SUM(Tabla1[[#This Row],[ATECIÓNCERRADA]:[ATENCIONDEURGENCIA]])=0,SUM(Tabla1[[#This Row],[ATECIÓNCERRADA]:[ATENCIONDEURGENCIA]])>1),"ERROR","OK")'; // col 217
    rowData[217] = '=IF(SUM(Tabla1[[#This Row],[INGRESO]:[SESIONES]])=0,"ERROR","OK")'; // col 218

    return rowData;
  });

  const csvContent = [
    EXPORT_HEADERS.join(delimiter),
    ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(delimiter))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
