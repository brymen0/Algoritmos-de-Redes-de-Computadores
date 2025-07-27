
export function vectorDistancia(graph) {
  const nodos = Object.keys(graph);
  const dist = {};
  const siguiente = {};
  const iteraciones = [];

  // Inicialización
  for (const nodo of nodos) {
    dist[nodo] = {};
    siguiente[nodo] = {};
    for (const destino of nodos) {
      dist[nodo][destino] = nodo === destino ? 0 : Infinity;
      siguiente[nodo][destino] = nodo === destino ? nodo : null;
    }
    for (const arista of graph[nodo].edges) {
      dist[nodo][arista.to] = arista.weight;
      siguiente[nodo][arista.to] = arista.to;
    }
  }

  let changed = true;

  while (changed) {
    changed = false;

    const nuevaDist = {};
    const nuevoSiguiente = {};

    for (const nodo of nodos) {
      nuevaDist[nodo] = { ...dist[nodo] };
      nuevoSiguiente[nodo] = { ...siguiente[nodo] };
    }

    for (const nodo of nodos) {
      for (const vecino of nodos) {
        if (dist[nodo][vecino] !== Infinity && nodo !== vecino) {
          for (const destino of nodos) {
            const nuevaDistancia = dist[nodo][vecino] + dist[vecino][destino];
            if (nuevaDistancia < nuevaDist[nodo][destino]) {
              nuevaDist[nodo][destino] = nuevaDistancia;
              nuevoSiguiente[nodo][destino] = siguiente[nodo][vecino];
              changed = true;
            }
          }
        }
      }
    }

    const paso = {};

    for (const nodo of nodos) {
        const vecinos = graph[nodo].edges.map(e => e.to).filter(v => v !== nodo); 
        const { tabla1, tabla2 } = generarTablasNodo(nodo, dist, siguiente, vecinos);
        paso[nodo] = { tabla1, tabla2 };
    }


    iteraciones.push(paso);

    // actualizar distancias
    for (const nodo of nodos) {
      dist[nodo] = { ...nuevaDist[nodo] };
      siguiente[nodo] = { ...nuevoSiguiente[nodo] };
    }
  }

  return iteraciones;
}

function generarTablasNodo(nodo, distancias, siguientes, vecinos) {
    const destinos = Object.keys(distancias[nodo]).sort();
    const vecinosOrdenados = [...vecinos].sort(); 

  const headers1 = ["", ...vecinosOrdenados];

  //tabla 1
    const filas1 = destinos.map(destino => {
    const filaVecinos = vecinosOrdenados.map(vecino => {
        const valor = distancias[vecino]?.[destino];
        return valor === undefined || valor === Infinity ? "∞" : valor;
    });

    return [destino, ...filaVecinos];
    });


  // tabla 2
    const headers2 = [nodo, ""];
    const filas2 = destinos.map(destino => {
    if (destino === nodo) return [0, nodo]; // si es el mismo nodo

    let mejorCosto = Infinity;
    let mejorVecino = "-";

    for (const vecino of vecinosOrdenados) {
      const costoVecino = distancias[nodo][vecino];
      const costoDesdeVecino = distancias[vecino]?.[destino];

      if (costoVecino !== Infinity && costoDesdeVecino !== Infinity) {
        const total = costoVecino + costoDesdeVecino;
        if (total < mejorCosto) {
          mejorCosto = total;
          mejorVecino = vecino;
        }
      }
    }

    return [
      mejorCosto === Infinity ? "∞" : mejorCosto,
      mejorVecino
    ];
  });

  return {
    tabla1: { headers: headers1, filas: filas1 },
    tabla2: { headers: headers2, filas: filas2 },
  };
}
