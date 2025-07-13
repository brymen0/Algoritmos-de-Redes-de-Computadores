export function prim(graph) {
  if (Object.keys(graph).length === 0) {
    console.log("El grafo está vacío.");
    return;
  }

  const visited = new Set();
  const mst = [];
  const edgesQueue = [];

  // Tomar cualquier nodo como inicio
  const startNodeName = Object.keys(graph)[0];

  function agregarAristas(nodoName) {
    visited.add(nodoName);
    const aristas = graph[nodoName].edges || [];

    for (const arista of aristas) {
      const destino = arista.to;
      const peso = arista.weight;
      if (!visited.has(destino)) {
        edgesQueue.push({ peso, origen: nodoName, destino });
      }
    }
  }

  agregarAristas(startNodeName);

  while (edgesQueue.length > 0 && visited.size < Object.keys(graph).length) {
    edgesQueue.sort((a, b) => a.peso - b.peso);

    const { peso, origen, destino } = edgesQueue.shift();
    if (!visited.has(destino)) {
      mst.push({ origen, destino, peso });
      agregarAristas(destino);
    }
  }

  console.log("Árbol de expansión mínima (Prim):");
  for (const { origen, destino, peso } of mst) {
    console.log(`${origen} -- ${peso} --> ${destino}`);
  }

  return mst;
}
