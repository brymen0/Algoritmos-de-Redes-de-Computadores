import { createContext, useContext, useState } from 'react';

const GraphContext = createContext();

export function GraphProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const setGraphData = (newNodes, newEdges) => {
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <GraphContext.Provider value={{ nodes, edges, setGraphData }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  return useContext(GraphContext);
}
