import Graph from '../components/Graph';
import './HomePage.css'; 

function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Redes de Compuradores</h1>
      </header>
      <main className="graph-section">
        <Graph />
      </main>
    </div>
  );
}

export default HomePage;
