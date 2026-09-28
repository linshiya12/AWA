const fs = require('fs');
const content = fs.readFileSync('./src/lib/mockData.ts', 'utf8');

// Match each template block from { id: 'tpl_... to either next { id: 'tpl_ or end of array
const blocks = content.split(/{\s*id:\s*'/).slice(1);

const results = [];
for (const b of blocks) {
  const idMatch = b.match(/^([^']+)'/);
  if (!idMatch) continue;
  const id = idMatch[1];
  const title = b.match(/title:\s*'([^']+)'/)?.[1];
  const mainCat = b.match(/mainCategory:\s*'([^']+)'/)?.[1];
  const produces = b.match(/produces:\s*'([^']+)'/)?.[1];
  const tools = [...b.matchAll(/toolsDB\.(\w+)/g)].map(m => m[1]);
  
  // Find guidance section
  const guidanceIndex = b.indexOf('guidance: [');
  let guidanceItems = [];
  if (guidanceIndex !== -1) {
    const after = b.substring(guidanceIndex);
    // Find matching bracket for guidance array
    let depth = 0;
    let endIndex = -1;
    for (let i = 10; i < after.length; i++) {
      if (after[i] === '[') depth++;
      else if (after[i] === ']') {
        if (depth === 0) {
          endIndex = i;
          break;
        }
        depth--;
      }
    }
    if (endIndex !== -1) {
      const guidanceSection = after.substring(10, endIndex);
      const stepBlocks = guidanceSection.split(/{\s*step:/).slice(1);
      guidanceItems = stepBlocks.map(sb => {
        const stepNum = sb.match(/^\s*(\d+)/)?.[1];
        const stepTitle = sb.match(/title:\s*'([^']+)'/)?.[1];
        const stepDesc = sb.match(/description:\s*'([^']+)'/)?.[1];
        const stepImg = sb.match(/image:\s*'([^']+)'/)?.[1];
        const stepTip = sb.match(/tip:\s*'([^']+)'/)?.[1];
        return { step: stepNum, title: stepTitle, desc: stepDesc, img: stepImg, tip: stepTip };
      });
    }
  }

  results.push({
    id,
    title,
    mainCat,
    tools,
    stepCount: guidanceItems.length,
    steps: guidanceItems
  });
}

console.log(JSON.stringify(results, null, 2));
