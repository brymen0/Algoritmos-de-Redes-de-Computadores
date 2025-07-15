import Graph from '../components/Graph';
import { useGraph } from '../context/GraphContext';
import './HomePage.css'; 

function HomePage() {
  const { nodes, edges, setGraphData } = useGraph();
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
          onGraphChange={(newNodes, newEdges) => setGraphData(newNodes, newEdges)}
        />
      </main>
    </div>
  );
}

export default HomePage;
