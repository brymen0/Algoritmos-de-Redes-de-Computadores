import Graph from "../components/Graph";
import { Button } from "../components/Button";
import { useRef } from "react";
import { reconstruirCamino, dijkstra } from "../logic/Dijkstra";

function DijkstraPage() {
  const originalGraphRef = useRef();
  const dijkstraGraphRef = useRef();
  function onClick() {
    const { nodes, edges } = originalGraphRef.current.getGraphData();

    if (nodes.length === 0) {
      alert('El grafo debe contener al menos un nodo.');
      return;
    }

    if (edges.length === 0) {
      alert('El grafo debe tener al menos una arista.');
      return;
    }

    const positionMap = new Map(); //obtener las posiciones de los nodos
      nodes.forEach(n => {
        positionMap.set(n.id, n.position);
      });

    // Convertir a grafo de adyacencia
    const graph = {};
    nodes.forEach(n => {
      graph[n.id] = { edges: [] };
    });

    edges.forEach(e => {
      const from = e.source;
      const to = e.target;
      const weight = Number(e.label) || 1;

      graph[from].edges.push({ to, weight });
      graph[to].edges.push({ to: from, weight }); // no dirigido
    });

    const { distancias, anteriores } = dijkstra(graph, 'S');
    const camino = reconstruirCamino(anteriores, 'S', 'T'); // si quieres A → F

    if (!camino) {
      alert('No hay camino disponible entre A y F.');
      return;
    }

    const caminoConPeso = camino.map(({ origen, destino }) => {
      const arista = graph[origen].edges.find(e => e.to === destino);
      return {
        origen,
        destino,
        peso: arista?.weight || 1
      };
    });

     // Convertir a nodos y edges para ReactFlow
    const dijkstraNodeSet = new Set();
    const dijkstraEdges = caminoConPeso.map(({ origen, destino, peso }) => {
      dijkstraNodeSet.add(origen);
      dijkstraNodeSet.add(destino);
      return {
        id: `e${origen}-${destino}`,
        source: origen,
        target: destino,
        label: `${peso}`,
        type: 'straight',
      };
    });

    const dijkstraNodes = Array.from(dijkstraNodeSet).map(id => ({
      id,
      type: 'circular', 
      data: { label: id },
      //position: { x: Math.random() * 300, y: Math.random() * 300 },
      position: positionMap.get(id) || { x: Math.random() * 300, y: Math.random() * 300 }
    }));

    dijkstraGraphRef.current.setGraphData(dijkstraNodes, dijkstraEdges);
  }
  return (
      <div className='prim-page-container'>
        <h1>Algoritmo Dijkstra</h1>
        <div className='prim-page'>
          <div className="prim-left">
            <h2>Grafo original</h2>
            <Graph ref={originalGraphRef} botones={true}/>
          </div>
          <div className="prim-divider" />
          <div className="prim-right">
            <h2>Camino más corto</h2>
            <Graph ref={dijkstraGraphRef} botones={false}/>
          </div>
        </div>
        <div className='prim-button-container'>
          <Button label='Calcular Grafo' onClick={onClick}></Button>
        </div>
      </div>
    );
}

export default DijkstraPage;
