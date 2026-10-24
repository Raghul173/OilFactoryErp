import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScriptPath = path.resolve(__dirname, '../ml/oil_yield_model.py');

/**
 * Executes the Python Scikit-Learn Linear Regression model script
 * and returns the prediction result object.
 */
export const runPythonMLPrediction = (oilType = 'Groundnut Oil', seedWeightKg = 1000) => {
  return new Promise((resolve, reject) => {
    const args = [
      pythonScriptPath,
      '--oil',
      String(oilType),
      '--seeds',
      String(seedWeightKg),
      '--json',
    ];

    execFile('python', args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (parseErr) {
        reject(new Error(`Failed to parse Python ML output: ${stdout || stderr}`));
      }
    });
  });
};

export default {
  runPythonMLPrediction,
};
