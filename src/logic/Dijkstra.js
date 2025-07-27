export function dijkstra(graph, origen) {
  if (!graph[origen]) {
    console.log(`El nodo '${origen}' no existe en el grafo.`);
    return { distancias: {}, anteriores: {}, iteraciones: [] };
  }

  const distancias = {};
  const anteriores = {};
  const visitado = new Set();
  const iteraciones = [];

  for (const nodo in graph) {
    distancias[nodo] = Infinity;
    anteriores[nodo] = null;
  }
  distancias[origen] = 0;
  anteriores[origen] = origen;

  const heap = [{ nodo: origen, distancia: 0 }];

  while (heap.length > 0) {
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

    iteraciones.push({
      nodoActual: actual,
      distancias: { ...distancias },
      anteriores: { ...anteriores }
    });
  }

  //imprimirTablaDijkstra(iteraciones, Object.keys(graph))
  const tablaResumen = imprimirTablaDijkstra(iteraciones, Object.keys(graph));
  return { distancias, anteriores, iteraciones, tablaResumen };
  //return { distancias, anteriores, iteraciones };
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

export function imprimirTablaDijkstra(iteraciones, nodos) {
  const encabezado = ['Nodo', ...iteraciones.map((_, i) => (i + 1).toString())];
  const tabla = [];
  const visitados = new Set();

  for (const nodo of nodos) {
    const fila = Array(iteraciones.length + 2).fill('');
    fila[0] = nodo;
    tabla.push(fila);
  }

  for (let i = 0; i < iteraciones.length; i++) {
    const { nodoActual, distancias, anteriores } = iteraciones[i];

    for (const fila of tabla) {
      const nodo = fila[0];

      if (visitados.has(nodo)) {
        fila[i + 1] = '*';
        continue;
      }

      if (nodo === nodoActual) {
        const valor = `${distancias[nodo]},${anteriores[nodo]}`;
        fila[i + 1] = valor;
        visitados.add(nodo);
      } else {
        const nuevoDist = distancias[nodo];
        const nuevoAnt = anteriores[nodo];
        const valor = nuevoDist !== Infinity ? `${nuevoDist},${nuevoAnt}` : '';
        const previo = fila[i];

        if (valor !== '' && valor !== previo && nuevoAnt === nodoActual) {
          fila[i + 1] = valor;
        }
      }
    }
  }

  // Iteración final: columna de asteriscos
  encabezado.push((iteraciones.length + 1).toString());
  for (const fila of tabla) {
    fila[iteraciones.length + 1] = '*';
  }

  return { encabezado, filas: tabla };
}


export function imprimirTablaDijkstra1(iteraciones, nodos) {
  const encabezado = ['Nodo', ...iteraciones.map((_, i) => (i + 1).toString())];
  const tabla = [];
  const visitados = new Set();

  for (const nodo of nodos) {
    const fila = Array(iteraciones.length + 1).fill('');
    fila[0] = nodo; // primera columna: nombre del nodo
    tabla.push(fila);
  }

  for (let i = 0; i < iteraciones.length; i++) {
    const { nodoActual, distancias, anteriores } = iteraciones[i];

    for (const fila of tabla) {
      const nodo = fila[0];

      if (visitados.has(nodo)) {
        fila[i + 1] = '*'; // columna actual
        continue;
      }

      if (nodo === nodoActual) {
        const valor = `${distancias[nodo]},${anteriores[nodo]}`;
        fila[i + 1] = valor;
        visitados.add(nodo);
      } else {
        // verificar si fue vecino del nodoActual y actualizado
        const nuevoDist = distancias[nodo];
        const nuevoAnt = anteriores[nodo];
        const valor = nuevoDist !== Infinity ? `${nuevoDist},${nuevoAnt}` : '';

        // verificar si ya tenía valor antes y no fue actualizado
        const previo = fila[i]; // celda anterior
        if (valor !== '' && valor !== previo && nuevoAnt === nodoActual) {
          fila[i + 1] = valor;
        }
      }
    }
  }

  // teración final
  encabezado.push((iteraciones.length + 1).toString());
  for (const fila of tabla) {
    fila[iteraciones.length + 1] = '*';
  }

  console.log(encabezado.join('\t'));
  for (const fila of tabla) {
    console.log(fila.join('\t'));
  }
}