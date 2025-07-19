import Graph from '../components/Graph';
import { Button } from '../components/Button';
import { useRef, useState } from 'react';
import './PrimPage.css';
import { prim } from '../logic/Prim';
import { useGraph } from '../context/GraphContext';

function PrimPage() {
  const { nodes, edges } = useGraph(); //grafo de home
  const originalGraphRef = useRef();
  const primGraphRef = useRef();
  const [mstText, setMstText] = useState('');

  const onClick = () => {
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
  
    const result = prim(graph);
    const mstText = result.map(({ origen, destino, peso }) => 
      `${origen} -- ${peso} --> ${destino}`
    ).join('\n');
    setMstText(mstText);
    setMstText(mstText);

    // Convertir a nodos y edges para ReactFlow
    const primNodeSet = new Set();
    const primEdges = result.map(({ origen, destino, peso }) => {
      primNodeSet.add(origen);
      primNodeSet.add(destino);
      return {
        id: `e${origen}-${destino}`,
        source: origen,
        target: destino,
        label: `${peso}`,
        type: 'straight',
      };
    });

    const primNodes = Array.from(primNodeSet).map(id => ({
      id,
      type: 'circular', 
      data: { label: id },
      //position: { x: Math.random() * 300, y: Math.random() * 300 },
      position: positionMap.get(id) || { x: Math.random() * 300, y: Math.random() * 300 }
    }));
    console.log("Se manda:")
    console.log("Nodos: ",primNodes)
    console.log("Enalces: ",primEdges)
    primGraphRef.current.setGraphData(primNodes, primEdges);
  };

  return (
    <div className='prim-page-container'>
      <h1>Algoritmo de Prim</h1>
      <div className='prim-page'>
        <div className="prim-left">
          <h2>Grafo original</h2>
          <Graph ref={originalGraphRef} botones={true} initialNodes={nodes} initialEdges={edges}/>
        </div>
        <div className="prim-divider" />
        <div className="prim-right">
          <h2>Árbol de expansión mínima</h2>
          <Graph ref={primGraphRef} botones={false}/>
        </div>
      </div>
      <div className='prim-button-container'>
        <Button label='Calcular Grafo' onClick={onClick}></Button>
      </div>
      {mstText && (
        <div className='result-container'>
          <h3>Resultado:</h3>
          <pre>{mstText}</pre>
        </div>
      )}
    </div>
  );
}

export default PrimPage;
