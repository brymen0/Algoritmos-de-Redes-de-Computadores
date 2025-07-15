export function prim(graph) {
  if (Object.keys(graph).length === 0) {
    console.log("El grafo está vacío.");
    return;
  }

  const visited = new Set();
  const camino= [];
  const aristasCandidatas = [];

  //toma cualquier nodo como inicio
  const startNode = Object.keys(graph)[0];

  agregarAristas(graph, visited, aristasCandidatas, startNode);

  while (aristasCandidatas.length > 0 && visited.size < Object.keys(graph).length) {
    aristasCandidatas.sort((a, b) => a.peso - b.peso); //ordena las aristas de forma ascendente

    const { peso, origen, destino } = aristasCandidatas.shift(); //devuelve y elimina la primera arista(la menor)
    if (!visited.has(destino)) {
      camino.push({ origen, destino, peso });
      agregarAristas(graph, visited, aristasCandidatas, destino);
    }
  }

  /*console.log("Árbol de expansión mínima (Prim):");
  for (const { origen, destino, peso } of camino) {
    console.log(`${origen} -- ${peso} --> ${destino}`);
  }*/

  return camino;
}

function agregarAristas(graph, visited, aristasCandidatas,nodo) { //agg a las aristas candidatas si un nodo tiene destino un nodo que aun no es visitado
    visited.add(nodo);
    const aristas = graph[nodo].edges || [];

    for (const arista of aristas) {
      const destino = arista.to;
      const peso = arista.weight;
      if (!visited.has(destino)) {
        aristasCandidatas.push({ peso, origen: nodo, destino });
      }
    }
  }
