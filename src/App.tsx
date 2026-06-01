import React, { useState, useEffect } from 'react';
import { Download, Plus, Sparkles, ClipboardPaste, Trash2, User, Table, FileText, Check, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { PatientRecord } from './types';
import { exportToCSV } from './lib/export';

const INITIAL_FORM_STATE: Omit<PatientRecord, 'id'> = {
  fecha: new Date().toISOString().split('T')[0],
  profesional: '',
  fichaUsuario: '',
  rutUsuario: '',
  diagnostico: '',
  codigo: '7',
  clasificacionPatologia: 'Sensoriales auditivos',
  sexo: '',
  edad: '',
  mai: true,
  pensionado: false,
  noBeneficiario: false,
  atencionCerrada: false,
  atencionAbierta: true,
  atencionUrgencia: false,
  ingreso: false,
  pti: false,
  consultaInicial: false,
  consultaIntermedia: false,
  sesiones: 0,
  rehabilitacionAuditiva: false,
  audiometriaAdultos: false,
  audiometriaNinos: false,
  audiometriaCampoLibre: false,
  calibracionAudifonos: false,
  funcionTubaria: false,
  emisionesOtoacusticas: false,
  rehabilitacionAuditiva3: false,
  potencialesEvocadosAuditivos: false,
  otoscopia: false,
  rehabilitacionVestibular: false,
  rehabilitacionLecturaLabiofacial: false,
  impendanciometria: false,
  pruebaDeAudifonos: false,
  testDeGlicerol: false,
  pruebaCalorica: false,
  examenFuncionalVIIIPar: false,
  estudioFuncionalEquilibrio: false,
  timpanometriaBandaAncha: false,
  habituacionVestibular: false,
  maniobraReposicionParticulas: false,
  maniobrasReposicionVestibular: false,
  alta: false
};

const TIPO_CONSULTA_BOOLEANS = [
  { key: 'ingreso', label: 'Ingreso' },
  { key: 'pti', label: 'PTI' },
  { key: 'consultaInicial', label: 'Consulta Inicial' },
  { key: 'consultaIntermedia', label: 'Consulta Intermedia' },
] as const;

const AUDIOLOGIA_PRESTACIONES = [
  { key: 'audiometriaAdultos', label: 'Audiometría Adultos (85)' },
  { key: 'audiometriaNinos', label: 'Audiometría Niños (86)' },
  { key: 'audiometriaCampoLibre', label: 'Audiometría Campo Libre (87)' },
  { key: 'calibracionAudifonos', label: 'Calibración Audífonos (88)' },
  { key: 'emisionesOtoacusticas', label: 'Emisiones Otoacústicas (90)' },
  { key: 'otoscopia', label: 'Otoscopía (93)' },
  { key: 'impendanciometria', label: 'Impedanciometría (96)' },
  { key: 'timpanometriaBandaAncha', label: 'Timpanometría B. Ancha (102)' },
  { key: 'funcionTubaria', label: 'Función Tubaria (89)' },
] as const;

const PRUEBAS_ESPECIALES = [
  { key: 'potencialesEvocadosAuditivos', label: 'Potenciales Evocados (92)' },
  { key: 'pruebaCalorica', label: 'Prueba Calórica (99)' },
  { key: 'examenFuncionalVIIIPar', label: 'Examen VIII Par (100)' },
  { key: 'estudioFuncionalEquilibrio', label: 'Equilibrio Plataforma (101)' },
  { key: 'pruebaDeAudifonos', label: 'Prueba de Audífonos (97)' },
  { key: 'testDeGlicerol', label: 'Test de Glicerol (98)' },
] as const;

const REHABILITACION_TERAPIA = [
  { key: 'rehabilitacionAuditiva', label: 'Rehab. Auditiva Indiv. (56)' },
  { key: 'rehabilitacionAuditiva3', label: 'Rehab. Auditiva Indiv. 3 (91)' },
  { key: 'rehabilitacionLecturaLabiofacial', label: 'Rehab. Lectura Labiofacial (95)' },
  { key: 'rehabilitacionVestibular', label: 'Rehabilitación Vestibular (94)' },
  { key: 'habituacionVestibular', label: 'Habituación Vestibular (103)' },
  { key: 'maniobraReposicionParticulas', label: 'Maniobra Partículas (104)' },
  { key: 'maniobrasReposicionVestibular', label: 'Maniobras Reposición (105)' },
  { key: 'alta', label: 'ALTA (192)' },
] as const;

export default function App() {
  const [activeTab, setActiveTab] = useState<'formulario' | 'planilla'>('formulario');
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [profesionalName, setProfesionalName] = useState(() => localStorage.getItem('medistats_profesional') || '');
  const [formData, setFormData] = useState<Omit<PatientRecord, 'id'>>(INITIAL_FORM_STATE);
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState('');
  const [dbLookupStatus, setDbLookupStatus] = useState('');
  const [systemMessage, setSystemMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | '' }>({ text: '', type: '' });

  // Get base URL for chrome extension vs local app
  const isExtension = window.location.protocol === 'chrome-extension:';
  const baseUrl = isExtension ? 'http://localhost:3000' : '';

  // Fetch records from Excel
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/records`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data || []);
      } else {
        console.error('Failed to fetch records from backend');
        showSystemMessage('Error al conectar con la base de datos Excel. ¿El servidor local está corriendo?', 'error');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      showSystemMessage('Error de conexión con el backend de Excel.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    localStorage.setItem('medistats_profesional', profesionalName);
    setFormData(prev => ({ ...prev, profesional: profesionalName }));
  }, [profesionalName]);

  const showSystemMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setSystemMessage({ text, type });
    setTimeout(() => setSystemMessage({ text: '', type: '' }), 6000);
  };

  // Perform database lookup when Ficha changes
  const handleFichaLookup = async (fichaVal: string) => {
    const ficha = fichaVal.trim();
    if (!ficha) return;
    
    setDbLookupStatus('Buscando en Excel...');
    try {
      const res = await fetch(`${baseUrl}/api/patient/${ficha}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const patient = data[0];
          
          // Determine if patient exists in records to select initial/intermediate
          const patientExists = records.some(r => r.fichaUsuario === ficha);
          
          setFormData(prev => ({
            ...prev,
            fichaUsuario: ficha,
            rutUsuario: patient.rutUsuario || prev.rutUsuario,
            diagnostico: patient.diagnostico || prev.diagnostico,
            sexo: patient.sexo || prev.sexo,
            edad: patient.edad || prev.edad,
            consultaIntermedia: patientExists,
            consultaInicial: !patientExists,
          }));
          setDbLookupStatus('✓ Datos importados de la base de datos');
          setTimeout(() => setDbLookupStatus(''), 4000);
        } else {
          setDbLookupStatus('Paciente nuevo (no registrado en BD)');
          setTimeout(() => setDbLookupStatus(''), 4000);
        }
      }
    } catch (err) {
      console.error('Error searching patient:', err);
      setDbLookupStatus('Error en búsqueda de paciente');
      setTimeout(() => setDbLookupStatus(''), 3000);
    }
  };

  const handleAutoRead = async () => {
    const chromeApi = (window as any).chrome;
    if (typeof chromeApi !== 'undefined' && chromeApi.tabs && chromeApi.scripting) {
      setParseError('');
      try {
        const [tab] = await chromeApi.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          const results = await chromeApi.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.body.innerText,
          });
          if (results && results[0] && results[0].result) {
            setRawText(results[0].result);
            showSystemMessage('Texto leído de la pantalla con éxito', 'success');
          } else {
            setParseError('No se encontró texto en la pestaña.');
          }
        }
      } catch (e: any) {
        console.error('Error reading tab:', e);
        setParseError('Error leyendo pantalla (requiere usar extensión real).');
      }
    } else {
      setParseError('No estás en una extensión de Chrome.');
    }
  };

  const handleParseText = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    setParseError('');
    try {
      const response = await fetch(`${baseUrl}/api/parse-sidra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText })
      });
      const data = await response.json();
      
      if (response.ok) {
        const inputFicha = data.fichaUsuario || '';
        const inputRut = data.rutUsuario || '';
        const inputEdad = data.edad || '';
        const inputSexo = data.sexo || '';

        // Fill initial extracted data
        setFormData(prev => ({
          ...prev,
          fichaUsuario: inputFicha || prev.fichaUsuario,
          rutUsuario: inputRut || prev.rutUsuario,
          edad: inputEdad || prev.edad,
          sexo: inputSexo || prev.sexo,
        }));
        
        setRawText('');
        showSystemMessage('Texto clínico analizado con éxito', 'success');

        // Trigger immediate lookup in the patient database if Ficha is extracted
        if (inputFicha) {
          handleFichaLookup(inputFicha);
        }
      } else {
        setParseError(data.error || 'Error al procesar el texto');
      }
    } catch (e: any) {
      setParseError(e.message || 'Error de conexión');
    } finally {
      setIsParsing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFichaBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleFichaLookup(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const record = { ...formData, profesional: profesionalName };
      
      // Save directly to local Excel file via API
      const response = await fetch(`${baseUrl}/api/save-record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        showSystemMessage(`Paciente guardado exitosamente en Fila ${data.row} del Excel`, 'success');
        
        // Clear form keeping date and profesional
        setFormData({
          ...INITIAL_FORM_STATE,
          fecha: formData.fecha,
          profesional: profesionalName
        });
        
        // Re-fetch records to show on the table
        fetchRecords();
      } else {
        showSystemMessage(data.error || 'Error al guardar en el archivo Excel', 'error');
      }
    } catch (err: any) {
      console.error('Error saving record:', err);
      showSystemMessage('Error de conexión al guardar el registro.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Get active procedures as string tags for the table view
  const getActiveProcedures = (r: PatientRecord) => {
    const active: string[] = [];
    
    // Check all mapped procedures
    [...AUDIOLOGIA_PRESTACIONES, ...PRUEBAS_ESPECIALES, ...REHABILITACION_TERAPIA].forEach(p => {
      if ((r as any)[p.key]) {
        active.push(p.label.split(' (')[0]); // get name without col number
      }
    });
    
    return active;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Header / Tool Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md shadow-blue-500/20">
            <ClipboardPaste className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight uppercase leading-none">
              Medi<span className="text-blue-500">Stats</span>
            </h1>
            <span className="text-[9px] text-slate-400 font-medium">Excel Sync & IA Extractor</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('formulario')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'formulario'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Captura e Ingreso
          </button>
          <button
            onClick={() => setActiveTab('planilla')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'planilla'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Vista Planilla Excel ({records.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Fonoaudiólogo..." 
              value={profesionalName}
              onChange={(e) => setProfesionalName(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-200 placeholder-slate-500 focus:ring-0 outline-none w-36"
            />
          </div>
          <button
            onClick={fetchRecords}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title="Sincronizar con Excel"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-hidden relative">
        {/* System Messages Banner */}
        {systemMessage.text && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg border shadow-xl text-xs font-semibold transition-all duration-300 animate-bounce ${
            systemMessage.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-300 border-emerald-800'
              : systemMessage.type === 'error'
              ? 'bg-rose-950/95 text-rose-300 border-rose-800'
              : 'bg-slate-900/95 text-slate-300 border-slate-800'
          }`}>
            {systemMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : systemMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : null}
            <span>{systemMessage.text}</span>
          </div>
        )}

        {/* Tab 1: Formulario */}
        {activeTab === 'formulario' && (
          <form onSubmit={handleSubmit} className="h-full grid grid-cols-12 overflow-hidden">
            {/* Left Col: Extractor & Patient Info */}
            <div className="col-span-5 bg-slate-950 border-r border-slate-900 p-5 flex flex-col overflow-y-auto space-y-4">
              
              {/* IA Parser Area */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-400" /> Extractor de Texto IA
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleAutoRead}
                      className="bg-teal-600 hover:bg-teal-500 text-white text-[10px] px-2 py-1 rounded font-bold transition-all shadow"
                    >
                      Autoleer
                    </button>
                    <button
                      type="button"
                      onClick={handleParseText}
                      disabled={isParsing || !rawText.trim()}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-[10px] px-2 py-1 rounded font-bold transition-all shadow"
                    >
                      {isParsing ? 'Procesando...' : 'Extraer con IA'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder="Pega la evolución de SIDRA o ficha clínica aquí..."
                  className="w-full h-16 p-2 text-xs bg-slate-950/80 rounded-lg border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none placeholder-slate-600 text-slate-200"
                />
                {parseError && <div className="text-[9px] text-rose-400 font-semibold">{parseError}</div>}
              </div>

              {/* Patient Fields Grid */}
              <div className="space-y-3.5">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ficha y Datos Demográficos</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 focus-within:border-blue-600 transition-colors relative">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Ficha Usuario</label>
                    <input 
                      required 
                      type="text" 
                      name="fichaUsuario" 
                      value={formData.fichaUsuario} 
                      onChange={handleChange} 
                      onBlur={handleFichaBlur}
                      className="w-full text-xs font-bold bg-transparent border-none p-0 focus:ring-0 outline-none text-white placeholder-slate-700" 
                      placeholder="Ej: 333962" 
                    />
                    {dbLookupStatus && (
                      <span className="absolute bottom-1 right-2 text-[8px] font-medium text-blue-400">
                        {dbLookupStatus}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 focus-within:border-blue-600 transition-colors">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">RUT Paciente</label>
                    <input 
                      required 
                      type="text" 
                      name="rutUsuario" 
                      value={formData.rutUsuario} 
                      onChange={handleChange} 
                      className="w-full text-xs font-bold bg-transparent border-none p-0 focus:ring-0 outline-none text-white placeholder-slate-700" 
                      placeholder="12345678-9" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 col-span-2">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Fecha de Atención</label>
                    <input 
                      required 
                      type="date" 
                      name="fecha" 
                      value={formData.fecha} 
                      onChange={handleChange} 
                      className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 outline-none text-white" 
                    />
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Código Base</label>
                    <input 
                      readOnly 
                      type="text" 
                      name="codigo" 
                      value={formData.codigo} 
                      className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 outline-none text-slate-500 cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 focus-within:border-blue-600 transition-colors">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Edad (Años)</label>
                    <input 
                      type="text" 
                      name="edad" 
                      value={formData.edad} 
                      onChange={handleChange} 
                      className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 outline-none text-white" 
                      placeholder="Edad" 
                    />
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 focus-within:border-blue-600 transition-colors">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Sexo</label>
                    <select 
                      name="sexo" 
                      value={formData.sexo} 
                      onChange={handleChange} 
                      className="w-full text-xs font-semibold bg-transparent border-none p-0 focus:ring-0 outline-none text-white cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Seleccionar</option>
                      <option value="M" className="bg-slate-900">Masculino (M)</option>
                      <option value="F" className="bg-slate-900">Femenino (F)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 focus-within:border-blue-600 transition-colors">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Diagnóstico Principal</label>
                  <input 
                    required 
                    type="text" 
                    name="diagnostico" 
                    value={formData.diagnostico} 
                    onChange={handleChange} 
                    className="w-full text-xs font-bold bg-transparent border-none p-0 focus:ring-0 outline-none text-white placeholder-slate-700" 
                    placeholder="Escribe o autodetecta el diagnóstico..." 
                  />
                </div>

                {/* Tipo de Consulta / Sesiones */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo Consulta & Sesiones</span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[9px] text-slate-500 font-bold">Nº Sesiones:</label>
                      <input 
                        type="number" 
                        min="0" 
                        name="sesiones" 
                        value={formData.sesiones} 
                        onChange={handleChange} 
                        className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-xs font-bold text-white w-14 text-center outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {TIPO_CONSULTA_BOOLEANS.map((item) => {
                      const isChecked = Boolean((formData as any)[item.key]);
                      return (
                        <label 
                          key={item.key} 
                          className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-blue-600/10 border-blue-500 text-blue-300' 
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            name={item.key} 
                            checked={isChecked} 
                            onChange={handleChange} 
                            className="w-3.5 h-3.5 text-blue-600 rounded bg-slate-950 border-slate-800" 
                          />
                          <span className="text-[10px] font-semibold leading-none">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Prestaciones Grid */}
            <div className="col-span-7 bg-slate-950 p-5 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4 overflow-y-auto flex-1 pr-1 pb-4">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selección de Prestaciones Realizadas</h2>
                
                {/* Audiology Category */}
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    Audiología Básica
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AUDIOLOGIA_PRESTACIONES.map((item) => {
                      const isChecked = Boolean((formData as any)[item.key]);
                      return (
                        <label 
                          key={item.key} 
                          className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer shadow-md ${
                            isChecked 
                              ? 'bg-blue-600/15 border-blue-500 text-blue-100' 
                              : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                          <input
                            type="checkbox"
                            name={item.key}
                            checked={isChecked}
                            onChange={handleChange}
                            className="w-3.5 h-3.5 text-blue-600 rounded bg-slate-950 border-slate-800"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Special Exams Category */}
                <div className="space-y-2 pt-2">
                  <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    Exámenes Especiales
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PRUEBAS_ESPECIALES.map((item) => {
                      const isChecked = Boolean((formData as any)[item.key]);
                      return (
                        <label 
                          key={item.key} 
                          className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer shadow-md ${
                            isChecked 
                              ? 'bg-indigo-600/15 border-indigo-500 text-indigo-100' 
                              : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                          <input
                            type="checkbox"
                            name={item.key}
                            checked={isChecked}
                            onChange={handleChange}
                            className="w-3.5 h-3.5 text-indigo-600 rounded bg-slate-950 border-slate-800"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Rehabilitation & Therapy Category */}
                <div className="space-y-2 pt-2">
                  <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                    Rehabilitación y Terapia
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {REHABILITACION_TERAPIA.map((item) => {
                      const isChecked = Boolean((formData as any)[item.key]);
                      return (
                        <label 
                          key={item.key} 
                          className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer shadow-md ${
                            isChecked 
                              ? 'bg-emerald-600/15 border-emerald-500 text-emerald-100' 
                              : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                          <input
                            type="checkbox"
                            name={item.key}
                            checked={isChecked}
                            onChange={handleChange}
                            className="w-3.5 h-3.5 text-emerald-600 rounded bg-slate-950 border-slate-800"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="shrink-0 pt-4 border-t border-slate-900 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => exportToCSV(records)}
                    disabled={records.length === 0}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 disabled:bg-slate-900 disabled:text-slate-600 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Exportar Backup CSV
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Guardando en Excel...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Guardar y Registrar en Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Planilla View */}
        {activeTab === 'planilla' && (
          <div className="h-full flex flex-col p-5 bg-slate-950 overflow-hidden space-y-4">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-sm font-bold text-slate-200">Planilla de Registro Médico (Últimos 50 Pacientes)</h2>
                <p className="text-[10px] text-slate-500">
                  Lectura directa del archivo <span className="font-bold text-slate-400">RHB2024 DEFINITIVA ESPINOZAa.xlsx</span> (Pestaña ESTADISTICA)
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={fetchRecords}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Recargar desde Excel
                </button>
                <button
                  onClick={() => exportToCSV(records)}
                  disabled={records.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar CSV Completo
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 border border-slate-900 rounded-xl overflow-hidden bg-slate-900/20 flex flex-col min-h-0">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse table-fixed">
                  <thead className="bg-slate-900 text-slate-400 sticky top-0 z-10">
                    <tr className="border-b border-slate-800 font-bold uppercase text-[9px] tracking-wider">
                      <th className="w-14 p-3 text-center">Fila</th>
                      <th className="w-24 p-3">Fecha</th>
                      <th className="w-20 p-3">Ficha</th>
                      <th className="w-28 p-3">RUT</th>
                      <th className="w-48 p-3 truncate">Diagnóstico</th>
                      <th className="w-14 p-3 text-center">Edad</th>
                      <th className="w-14 p-3 text-center">Sexo</th>
                      <th className="w-16 p-3 text-center">Sesiones</th>
                      <th className="w-80 p-3">Prestaciones Realizadas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {isLoading && records.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                            <span>Leyendo datos de Excel...</span>
                          </div>
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500 font-medium">
                          No se encontraron registros de Ariel Espinoza en el Excel.
                        </td>
                      </tr>
                    ) : (
                      records.map((r, idx) => {
                        const activeProcs = getActiveProcedures(r);
                        return (
                          <tr key={r.id || idx} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3 text-center font-mono font-bold text-slate-500">{r.row || '-'}</td>
                            <td className="p-3 font-semibold text-slate-200">{r.fecha}</td>
                            <td className="p-3 font-semibold text-slate-300">{r.fichaUsuario}</td>
                            <td className="p-3 font-semibold font-mono">{r.rutUsuario}</td>
                            <td className="p-3 truncate font-medium text-slate-200" title={r.diagnostico}>
                              {r.diagnostico}
                            </td>
                            <td className="p-3 text-center font-bold text-slate-400">{r.edad}</td>
                            <td className="p-3 text-center font-bold text-slate-400">{r.sexo}</td>
                            <td className="p-3 text-center font-semibold font-mono text-slate-300">{r.sesiones}</td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto pr-1">
                                {activeProcs.length === 0 ? (
                                  <span className="text-[10px] text-slate-600">Ninguna</span>
                                ) : (
                                  activeProcs.map((p, pIdx) => (
                                    <span 
                                      key={pIdx} 
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 border border-blue-900 text-blue-300 leading-none"
                                    >
                                      {p}
                                    </span>
                                  ))
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 px-5 py-2 flex items-center justify-between shrink-0 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>ESTADISTICA SYNC: <span className="text-green-400 font-bold">CONECTADO</span></span>
        </div>
        <div>
          <span>Destinatario: <span className="text-slate-300 font-bold">Ariel Espinoza</span></span>
          <span className="mx-2">|</span>
          <span>Total Registros Cargados: <span className="text-slate-300 font-bold">{records.length}</span></span>
        </div>
      </footer>
    </div>
  );
}
