import Graph from '../components/Graph';
import { useGraph } from '../context/GraphContext';
import './HomePage.css'; 
import { useCallback } from 'react';

function HomePage() {
  const { nodes, edges, setGraphData } = useGraph();

  const handleGraphChange = useCallback((newNodes, newEdges) => {
  setGraphData(newNodes, newEdges);
}, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Redes de Computadores</h1>
      </header>
      <main className="graph-section">
        <Graph
          botones={true}
          initialNodes={nodes}
          initialEdges={edges}
          //onGraphChange={(newNodes, newEdges) => setGraphData(newNodes, newEdges)}
          onGraphChange={handleGraphChange}
        />
      </main>
    </div>
  );
}

export default HomePage;
