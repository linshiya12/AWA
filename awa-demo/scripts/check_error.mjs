const res = await fetch('http://localhost:3000/template/tpl_1');
console.log('Status:', res.status);
const text = await res.text();
// Search for common error phrases or JSON error objects in Next.js dev server output
const errIdx = text.indexOf('Error:');
if (errIdx !== -1) {
  console.log('Error found:', text.slice(errIdx, errIdx + 400));
} else {
  // Save full html to inspect
  console.log('Snippet:', text.slice(0, 1500));
}
