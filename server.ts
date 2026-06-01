import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { spawn } from 'child_process';

function runPython(args: string[], inputData?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['excel_manager.py', ...args]);
    let output = '';
    let errorOutput = '';

    if (inputData !== undefined && pythonProcess.stdin) {
      pythonProcess.stdin.write(JSON.stringify(inputData));
      pythonProcess.stdin.end();
    }

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}. Error: ${errorOutput}`));
        return;
      }
      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    });
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to get records from Excel
  app.get('/api/records', async (req, res) => {
    try {
      const data = await runPython(['read']);
      if (data.error) {
        return res.status(500).json({ error: data.error });
      }
      res.json(data.records);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Error reading records' });
    }
  });

  // API to search patient in USUARIOS database sheet
  app.get('/api/patient/:query', async (req, res) => {
    try {
      const { query } = req.params;
      const data = await runPython(['search', query]);
      if (data.error) {
        return res.status(500).json({ error: data.error });
      }
      res.json(data.patients);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Error searching patient' });
    }
  });

  // API to write a patient record to Excel
  app.post('/api/save-record', async (req, res) => {
    try {
      const data = await runPython(['write'], req.body);
      if (data.error) {
        return res.status(500).json({ error: data.error });
      }
      res.json(data);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Error writing record' });
    }
  });

  // API Route for AI text parsing
  app.post('/api/parse-sidra', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required.' });
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Setup missing.' });
      }
      
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Extract the following patient data from this raw clinical text: 
        1. Ficha/ID of User
        2. RUT (Chilean ID format without points but with dash, eg: 12345678-9)
        3. Age (Edad - just the number)
        4. Sex (Sexo: M for masculine, F for feminine)
        
        Return ONLY valid JSON according to the schema. If you can't find a field, leave it empty.
        
        Raw Text:
        ${text}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fichaUsuario: { type: Type.STRING, description: "Patient ID or Ficha" },
              rutUsuario: { type: Type.STRING, description: "Patient RUT" },
              edad: { type: Type.STRING, description: "Patient Age in years" },
              sexo: { type: Type.STRING, description: "Patient Sex (M or F)" },
              nombre: { type: Type.STRING, description: "Patient Full Name if available" }
            }
          }
        }
      });
      
      if (!response.text) {
         return res.json({});
      }
      
      const parsed = JSON.parse(response.text);
      res.json(parsed);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Error processing request' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
