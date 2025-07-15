export function dijkstra(graph, origen) {
  if (!graph[origen]) {
    console.log(`El nodo '${origen}' no existe en el grafo.`);
    return [];
  }

  const distancias = {};
  const anteriores = {};
  const visitado = new Set();

  for (const nodo in graph) {
    distancias[nodo] = Infinity;
    anteriores[nodo] = null;
  }
  distancias[origen] = 0;

  const heap = [{ nodo: origen, distancia: 0 }];

  while (heap.length > 0) {
    // Ordenamos el heap por distancia ascendente
    heap.sort((a, b) => a.distancia - b.distancia);
    const { nodo: actual } = heap.shift();

    if (visitado.has(actual)) continue;
    visitado.add(actual);

    for (const arista of graph[actual].edges || []) {
      const { to: vecino, weight: peso } = arista;
      const nuevaDist = distancias[actual] + peso;

      if (nuevaDist < distancias[vecino]) {
        distancias[vecino] = nuevaDist;
        anteriores[vecino] = actual;
        heap.push({ nodo: vecino, distancia: nuevaDist });
      }
    }
  }

  // Mostrar distancias mínimas
  console.log(`Distancias mínimas desde '${origen}':`);
  for (const destino in distancias) {
    console.log(`${origen} → ${destino} = ${distancias[destino]}`);
  }

  return { distancias, anteriores };
}

export function reconstruirCamino(anteriores, origen, destino) {
  const camino = [];
  let actual = destino;

  while (actual !== origen) {
    if (actual === null) return null; // No hay camino
    const previo = anteriores[actual];
    camino.unshift({ origen: previo, destino: actual });
    actual = previo;
  }

  return camino;
}
