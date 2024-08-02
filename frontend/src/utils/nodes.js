/**
 * Find and return a single node in the data whose key matches the provided key.
 *
 * @param {Object[]} nodes - The array of nodes to search
 * @param {string} key - The key of the node to search for
 * @returns {Object|null} - The found node, or null if not found
 *
 */
export const findNodeFromKey = (nodes, key) => {
  let foundNode = null;

  const findNode = (nodes) => {
    if (!nodes) return;

    for (const node of nodes) {
      if (node.key === key) {
        foundNode = node;
        return;
      }
      if (node.children) {
        findNode(node.children);
        if (foundNode) {
          return;
        }
      }
    }
  };

  findNode(nodes);
  return foundNode;
};

/**
 * Find and return all nodes in {Array} data whose key is in {Object} keys
 *
 * @param {Object[]} data - The array of nodes to search
 * @param {Object} keys - Object with {keys: boolean} to search for
 * @returns {Object[]} - Array of nodes with keys that match the keys in keys
 *
 */
export const findNodeListByKey = (data, keys) => {
  let foundNodes = [];

  const findNodes = (nodes) => {
    if (!nodes) return;

    nodes.forEach((node) => {
      if (keys[node.key]) {
        foundNodes.push(node);
      }
      if (node.children) {
        findNodes(node.children);
      }
    });
  };

  findNodes(data);
  return foundNodes;
};

/**
 * Verify that the copied nodes have the same depth
 * Used to disalow nodes of different depth to be copied or moved together
 *
 * @param {Object[]} copiedNodes - Array of nodes to verify
 * @returns {boolean} - True if all nodes have the same depth; false otherwise
 */
export const isCopiedNodesSiblings = (copiedNodes) => {
  const depthOfFirstSelectedNode = copiedNodes[0].depth;
  return !copiedNodes.some((node) => node.depth !== depthOfFirstSelectedNode);
};

/**
 * Get all nodekeys in the node hierarchy.
 *
 * @param {Object[]} nodes - The node hierarchy.
 * @returns {number[]} - Array of all nodekeys
 */
export const getAllNodeKeys = (nodes) => {
  let nodeKeys = [];
  const queue = [...nodes];

  while (queue.length) {
    const currentNode = queue.shift();
    nodeKeys.push(currentNode.key);

    currentNode.children.forEach((child) => queue.push(child));
  }

  return nodeKeys;
};

/**
 * Sorts nodes into categories based on their type.
 *
 * @param {Object[]} nodes - The array of nodes to sort.
 * @returns {Object} - An object with arrays of nodes categorized by their type.
 */
export const sortNodesByType = (projectHierarchy) => {
  const sortedNodes = {
    sone: [],
    fasade: [],
    gulv: [],
    tak: [],
    vinduOgDør: [],
    ventilasjon: [],
    internlast: [],
    skillekonstruksjon: [],
  };

  const findNodes = (nodes) => {
    if (!nodes) return;
    nodes.forEach((node) => {
      if (sortedNodes[node.type]) {
        sortedNodes[node.type].push(node);
      }
      if (node.children) {
        findNodes(node.children);
      }
    });
  };

  findNodes(projectHierarchy.children);
  console.log("sortedNodes: ", sortedNodes);
  return sortedNodes;
};
