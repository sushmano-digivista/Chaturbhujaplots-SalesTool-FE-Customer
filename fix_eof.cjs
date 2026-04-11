const fs = require('fs');
const file = 'src/tests/e2e/homepage.spec.js';
let c = fs.readFileSync(file, 'utf8');

// Fix missing closing }) for test 10.3
c = c.replace(
  "    expect(b103).toMatch(/99487|Call Us|WhatsApp|Chaturbhuja/)\n})",
  "    expect(b103).toMatch(/99487|Call Us|WhatsApp|Chaturbhuja/)\n  })\n})"
);

fs.writeFileSync(file, c);
console.log('Fixed!');
