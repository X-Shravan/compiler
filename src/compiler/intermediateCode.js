/**
 * Intermediate Code Generator (Three Address Code)
 * Performs post-order traversal of the AST to generate Three Address Code (TAC),
 * Quadruples, and Triples representations.
 */

export function generateThreeAddressCode(ast) {
  if (!ast) {
    return {
      instructions: [],
      rawText: '',
      quadruples: [],
      triples: [],
      temporaryVars: [],
      finalResult: null
    };
  }

  // Handle single node edge case e.g., 'a' or '10'
  if (ast.type === 'Identifier' || ast.type === 'Number') {
    const val = ast.type === 'Identifier' ? ast.name : String(ast.value);
    const temp = 't1';
    const text = `${temp} = ${val}`;
    return {
      instructions: [{ line: 1, text, result: temp, op: '=', arg1: val, arg2: '-' }],
      rawText: ` 1  ${text}`,
      quadruples: [{ index: 0, op: '=', arg1: val, arg2: '-', result: temp }],
      triples: [{ index: 0, op: '=', arg1: val, arg2: '-' }],
      temporaryVars: [temp],
      finalResult: temp
    };
  }

  let tempCounter = 1;
  const instructions = [];
  const quadruples = [];
  const triples = [];
  const temporaryVars = [];

  function traverse(node) {
    if (!node) return '';

    if (node.type === 'Identifier') {
      return node.name;
    }

    if (node.type === 'Number') {
      return String(node.value);
    }

    if (node.type === 'BinaryOp') {
      // Post-order traversal: left child, then right child
      const leftAddr = traverse(node.left);
      const rightAddr = traverse(node.right);

      const temp = `t${tempCounter++}`;
      temporaryVars.push(temp);

      const lineNum = instructions.length + 1;
      const text = `${temp} = ${leftAddr} ${node.op} ${rightAddr}`;

      instructions.push({
        line: lineNum,
        text,
        result: temp,
        op: node.op,
        arg1: leftAddr,
        arg2: rightAddr
      });

      quadruples.push({
        index: lineNum - 1,
        op: node.op,
        arg1: leftAddr,
        arg2: rightAddr,
        result: temp
      });

      triples.push({
        index: lineNum - 1,
        op: node.op,
        arg1: leftAddr,
        arg2: rightAddr
      });

      return temp;
    }

    return '';
  }

  const finalResult = traverse(ast);

  return {
    instructions,
    rawText: instructions.map(i => `${i.line.toString().padStart(2, ' ')}  ${i.text}`).join('\n'),
    quadruples,
    triples,
    temporaryVars,
    finalResult
  };
}
