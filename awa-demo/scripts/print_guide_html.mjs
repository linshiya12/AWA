const res = await fetch('http://localhost:3000/template/tpl_1');
const t = await res.text();
const start = t.indexOf('id="step-by-step-guide"');
console.log(t.slice(start, start + 1500));
