require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
          export const environment = {  
              backendBaseUrl: "${ process.env['BACKEND_BASE_URL'] }",
          };`

const { mkdirSync, writeFileSync } = require('fs'); 

mkdirSync('./src/environments', { recursive: true });
writeFileSync( targetPath, envFileContent );  