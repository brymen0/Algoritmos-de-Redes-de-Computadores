import { useRef, useState } from "react";
import { useGraph } from "../context/GraphContext";
import Graph from "../components/Graph"
import { Button } from "../components/Button";
import './VectorDistanciaPage.css'
import { vectorDistancia } from "../logic/VectorDistancia";
import { Tabla } from "../components/Tabla";

function VectorDistanciaPage() {
  const { nodes, edges } = useGraph(); //grafo de home
  const originalGraphRef = useRef();
  const [calcular, setCalcular] = useState(false);
  const [iteracion, setIteracion] = useState(null);
  const [iteraciones, setIteraciones] = useState([]);


  const onClickCalcular = () => {
    const { nodes, edges } = originalGraphRef.current.getGraphData();
    
    if (nodes.length === 0) {
      alert('El grafo debe contener al menos un nodo.');
      return;
    }

    if (edges.length === 0) {
      alert('El grafo debe tener al menos una arista.');
      return;
    }

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

    const resultado = vectorDistancia(graph);
    console.log(resultado)
    setIteraciones(resultado);
    setCalcular(true);
    setIteracion(0);
  }

  const onClickSiguiente = () => {
    if (iteracion < iteraciones.length){
      setIteracion(iteracion+1);
    }
  }

  const onClickAnterior = () => {
    if (iteracion != 0){
      setIteracion(iteracion-1);
    }
  }



  return (
    <div className='vector-distancia-container'>
      <h1>Algoritmo de Enrutamiento Vector - Distancia</h1>
      <div className='vector-distancia-page'>
        <div className="graph-left">
          <Graph ref={originalGraphRef} botones={true} initialNodes={nodes} initialEdges={edges}/>
        </div>
        <div className="prim-divider" />
        <div className="container-right">
          <div className="tablas-container">
            {calcular && iteraciones[iteracion] && (
              <>
                <h2 className="iteracion-titulo">
                  Iteración {iteracion+1}
                </h2>
                {Object.entries(iteraciones[iteracion]).map(([nodo, { tabla1, tabla2 }]) => (
                  <div key={nodo} className="tabla-nodo">
                    <h3>Nodo {nodo}</h3>
                    <div className="tablas-paralelas">
                      <Tabla headers={tabla1.headers} data={tabla1.filas} />
                      <Tabla headers={tabla2.headers} data={tabla2.filas} />
                    </div>
                  </div>
                ))}

              </>
            )}

          </div>

          {calcular && 
          <div className="buttons-container">
            {iteracion != 0 && <Button label='Anterior' onClick={onClickAnterior}></Button>}
            {iteracion < iteraciones.length-1 && <Button label='Siguiente' onClick={onClickSiguiente}></Button>}
          </div>
          }
        </div>
      </div>
      <div className='prim-button-container'>
        <Button label='Calcular Vector Distancia' onClick={onClickCalcular}></Button>
      </div>
    </div>
  );
}

export default VectorDistanciaPage;
