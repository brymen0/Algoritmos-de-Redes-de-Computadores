import Graph from "../components/Graph";
import { Button } from "../components/Button";
import { useRef, useState, useEffect } from "react";
import { reconstruirCamino, dijkstra } from "../logic/Dijkstra";
import { useGraph } from '../context/GraphContext';
import { ComboBox} from "../components/ComboBox"
import { Tabla } from "../components/Tabla";
import "./DijkstraPage.css"

function DijkstraPage() {
  const { nodes, edges } = useGraph(); //grafo de home
  const originalGraphRef = useRef();
  const dijkstraGraphRef = useRef();
  const [origen, setOrigen] = useState("");
  const [resultados, setResultados] = useState([]);
  const [comboOptions, setComboOptions] = useState([]);
  const [iteraciones, setIteraciones] = useState([]);
  const [filasTabla, setFilasTabla] = useState([]);
  const [mostrarTablas, setMostrarTablas] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentGraph = originalGraphRef.current?.getGraphData();
      if (currentGraph?.nodes) {
        setComboOptions(currentGraph.nodes.map(n => ({
          value: n.id,
          label: n.id
        })));
      }
    }, 500); //actuaza cada medio segundo

    return () => clearInterval(interval);
  }, []);

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

    //const { distancias, anteriores, iteraciones } = dijkstra(graph, origen);
    //console.log("Iteraciones", iteraciones)
    const { distancias, anteriores, iteraciones, tablaResumen } = dijkstra(graph, origen);
    setIteraciones(iteraciones);
    setFilasTabla(tablaResumen);
    const nodos = Object.keys(graph); // basado en el grafo adyacente

    const todosLosEdges = [];
    const nuevosResultados = [];

    for (const destino in distancias) {
      if (destino === origen || distancias[destino] === Infinity) continue;

      const camino = reconstruirCamino(anteriores, origen, destino);
      if (!camino || camino.length === 0) continue;

      const nodosVisitados = [origen, ...camino.map(p => p.destino)];
      const caminoConPeso = camino.map(({ origen, destino }) => {
        const arista = graph[origen].edges.find(e => e.to === destino);
        return {
          origen,
          destino,
          peso: arista?.weight || 1
        };
      });

      // Guardar resultados para tabla
      const pesoTotal = caminoConPeso.reduce((acc, paso) => acc + paso.peso, 0);
      nuevosResultados.push({
        destino,
        peso: pesoTotal,
        recorrido: nodosVisitados.join(','),
      });

      // Guardar aristas para visualización
      todosLosEdges.push(...caminoConPeso);
    }

    const graphRunId = Date.now().toString(); // una sola vez por ejecución
    setResultados(nuevosResultados);
    dijkstraGraphRef.current.clearGraph();

    //convertir al formato para renderizaar
    const dijkstraNodeSet = new Set();
    const dijkstraEdges = todosLosEdges.map(({ origen, destino, peso }, idx) => {
      dijkstraNodeSet.add(origen);
      dijkstraNodeSet.add(destino);
      return {
        id: `e${graphRunId}-${origen}-${destino}-${idx}`,
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
    setMostrarTablas(true);
    dijkstraGraphRef.current.setGraphData(dijkstraNodes, dijkstraEdges);
  }

  const filas = resultados.map(({ destino, peso, recorrido }) => [
    destino,
    peso.toString(),
    recorrido
  ]);

  return (
      <div className={`prim-page-container ${mostrarTablas ? 'conTablas' : ''}`}>
        <h1>Algoritmo Dijkstra</h1>
        <div className='prim-page'>
          <div className="prim-left">
            <h2>Grafo original</h2>
            <Graph ref={originalGraphRef} botones={true} initialNodes={nodes} initialEdges={edges}/>
          </div>
          <div className="prim-divider" />
          <div className="prim-right">
            <h2>Camino más corto</h2>
            <ComboBox 
              text='Desde' 
              options={comboOptions}
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
            />
            <Graph ref={dijkstraGraphRef} botones={false}/>
          </div>
        </div>
        <div className='prim-button-container'>
          <Button label='Calcular Grafo' onClick={onClick}></Button>
        </div>
        {mostrarTablas && <div className="tabla-dijkstra">
          <h2>Tabla Dijkstra</h2>
          {iteraciones.length > 0 &&
            <Tabla
              headers={filasTabla.encabezado}
              data={filasTabla.filas}
            />
          }
        </div>}

        {mostrarTablas && <div className="caminos-container">
          <h2>Resumen de caminos desde {origen}</h2>
          <Tabla
            headers={['Hacia', 'Peso', 'Camino']}
            data={filas}
          />
        </div>}
      </div>
    );
}

export default DijkstraPage;
