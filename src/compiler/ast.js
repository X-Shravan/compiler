/**
 * Abstract Syntax Tree (AST) Node definitions and layout calculation
 */

export class BinaryOpNode {
  constructor(op, left, right, pos) {
    this.type = 'BinaryOp';
    this.op = op;
    this.left = left;
    this.right = right;
    this.pos = pos;
  }
}

export class IdentifierNode {
  constructor(name, pos) {
    this.type = 'Identifier';
    this.name = name;
    this.pos = pos;
  }
}

export class NumberNode {
  constructor(value, pos) {
    this.type = 'Number';
    this.value = value;
    this.pos = pos;
  }
}

/**
 * Calculates (x, y) coordinates for an SVG layout of the AST.
 * Uses a clean hierarchical layout with subtree bounding to prevent node overlaps.
 */
export function layoutAST(rootNode) {
  if (!rootNode) return null;

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 76;
  const MIN_HORIZONTAL_GAP = 28;

  let nextId = 1;

  // First pass: clone & enrich with layout metadata and compute subtree widths
  function prepareNode(node, depth = 0) {
    if (!node) return null;

    const visualNode = {
      id: `ast-node-${nextId++}`,
      type: node.type,
      depth,
      pos: node.pos,
      left: null,
      right: null,
      x: 0,
      y: depth * LEVEL_HEIGHT + 44,
      width: 0,
      label: '',
      category: ''
    };

    if (node.type === 'BinaryOp') {
      visualNode.label = node.op;
      visualNode.category = 'operator';
      visualNode.left = prepareNode(node.left, depth + 1);
      visualNode.right = prepareNode(node.right, depth + 1);
    } else if (node.type === 'Identifier') {
      visualNode.label = node.name;
      visualNode.category = 'identifier';
    } else if (node.type === 'Number') {
      visualNode.label = String(node.value);
      visualNode.category = 'number';
    }

    return visualNode;
  }

  const root = prepareNode(rootNode);

  // Compute subtree widths
  function computeSubtreeWidth(node) {
    if (!node) return 0;
    if (!node.left && !node.right) {
      node.width = NODE_RADIUS * 2 + MIN_HORIZONTAL_GAP;
      return node.width;
    }

    const leftWidth = computeSubtreeWidth(node.left);
    const rightWidth = computeSubtreeWidth(node.right);
    node.width = Math.max(NODE_RADIUS * 2 + MIN_HORIZONTAL_GAP, leftWidth + rightWidth);
    return node.width;
  }

  computeSubtreeWidth(root);

  // Assign X coordinates recursively
  function assignCoordinates(node, leftBound, rightBound) {
    if (!node) return;

    node.x = (leftBound + rightBound) / 2;

    if (node.left && node.right) {
      const totalChildWidth = node.left.width + node.right.width;
      const leftRatio = node.left.width / totalChildWidth;
      const splitPoint = leftBound + (rightBound - leftBound) * leftRatio;

      assignCoordinates(node.left, leftBound, splitPoint);
      assignCoordinates(node.right, splitPoint, rightBound);
    } else if (node.left) {
      assignCoordinates(node.left, leftBound, rightBound);
    } else if (node.right) {
      assignCoordinates(node.right, leftBound, rightBound);
    }
  }

  const totalWidth = Math.max(root.width + 60, 480);
  assignCoordinates(root, 30, totalWidth - 30);

  // Collect all nodes and edges for SVG rendering
  const nodes = [];
  const edges = [];

  function collect(node) {
    if (!node) return;
    nodes.push(node);

    if (node.left) {
      edges.push({
        id: `${node.id}->${node.left.id}`,
        fromX: node.x,
        fromY: node.y,
        toX: node.left.x,
        toY: node.left.y
      });
      collect(node.left);
    }

    if (node.right) {
      edges.push({
        id: `${node.id}->${node.right.id}`,
        fromX: node.x,
        fromY: node.y,
        toX: node.right.x,
        toY: node.right.y
      });
      collect(node.right);
    }
  }

  collect(root);

  // Calculate bounding box
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;

  for (const n of nodes) {
    if (n.x - NODE_RADIUS < minX) minX = n.x - NODE_RADIUS;
    if (n.x + NODE_RADIUS > maxX) maxX = n.x + NODE_RADIUS;
    if (n.y + NODE_RADIUS > maxY) maxY = n.y + NODE_RADIUS;
  }

  const padding = 40;
  const svgWidth = Math.max(maxX - minX + padding * 2, 420);
  const svgHeight = maxY + padding + 20;

  // Center horizontally if needed
  const shiftX = (svgWidth - (maxX - minX)) / 2 - minX;
  for (const n of nodes) {
    n.x += shiftX;
  }
  for (const e of edges) {
    e.fromX += shiftX;
    e.toX += shiftX;
  }

  return {
    root,
    nodes,
    edges,
    nodeRadius: NODE_RADIUS,
    width: svgWidth,
    height: svgHeight
  };
}
