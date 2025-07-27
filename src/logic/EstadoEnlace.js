export function estadoEnlace(enlacesPorOrigen) {
  const nodesSet = new Set();
  const edgeSet = new Set();
  const nodes = [];
  const edges = [];

  for (const origen in enlacesPorOrigen) {
    const aristas = enlacesPorOrigen[origen] || [];

    for (const { destino, peso } of aristas) {
      const nodoA = origen.trim();
      const nodoB = destino.trim();
      const enlaceId = [nodoA, nodoB].sort().join('-'); // A-B (ordenado)

      // arista única en grafo no dirigido
      if (!edgeSet.has(enlaceId)) {
        edgeSet.add(enlaceId);

        // Añadir nodos si no están aún
        if (!nodesSet.has(nodoA)) {
          nodesSet.add(nodoA);
          nodes.push({
            id: nodoA,
            type: 'circular',
            data: { label: nodoA, className: 'node-container' },
            position: {
              x: Math.random() * 400,
              y: Math.random() * 400
            }
          });
        }

        if (!nodesSet.has(nodoB)) {
          nodesSet.add(nodoB);
          nodes.push({
            id: nodoB,
            type: 'circular',
            data: { label: nodoB, className: 'node-container' },
            position: {
              x: Math.random() * 400,
              y: Math.random() * 400
            }
          });
        }

        edges.push({
          id: enlaceId,
          source: nodoA,
          target: nodoB,
          label: peso,
          type: 'straight',
          markerEnd: undefined
        });
      }
    }
  }

  return { nodes, edges };
}
