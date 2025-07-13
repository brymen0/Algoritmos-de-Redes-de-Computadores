import Graph from "../components/Graph";
import { Button } from "../components/Button";

function DijkstraPage() {
  function onClick() {
    console.log("Calcular")
  }
  return (
      <div className='prim-page-container'>
        <h1>Algoritmo Dijkstra</h1>
        <div className='prim-page'>
          <div className="prim-left">
            <h2>Grafo original</h2>
            <Graph botones={true}/>
          </div>
          <div className="prim-divider" />
          <div className="prim-right">
            <h2>Camino más corto</h2>
            <Graph botones={false}/>
          </div>
        </div>
        <div className='prim-button-container'>
          <Button label='Calcular Grafo' onClick={onClick}></Button>
        </div>
      </div>
    );
}

export default DijkstraPage;
