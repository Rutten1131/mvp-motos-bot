const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../lib/db.ts');
let c = fs.readFileSync(file, 'latin1');
if (!c.includes('dotenv.config')) {
  c = `import dotenv from "dotenv";\ndotenv.config({ path: ".env.local" });\ndotenv.config();\n` + c;
  fs.writeFileSync(file, c, 'latin1');
  console.log("dotenv inyectado exitosamente en lib/db.ts");
} else {
  console.log("dotenv ya estaba presente en lib/db.ts");
}

