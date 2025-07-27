import React, { useState, useCallback, useRef, useImperativeHandle,forwardRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from './Button';
import { Input } from './Input'; 
import { CircularNode } from './CircularNode';
import './Graph.css'
import isEqual from 'lodash.isequal';

const nodeTypes = {
  circular: CircularNode,
};

function Graph({ botones, initialNodes = [], initialEdges = [], onGraphChange}, ref) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [showInput, setShowInput] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null); 
  const inputRef = useRef(null); 

  const [pendingConnection, setPendingConnection] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [showEdgeInput, setShowEdgeInput] = useState(false);
  const edgeInputRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof onGraphChange === 'function') {
        onGraphChange(nodes, edges);
      }
    }, 0); // permite que ReactFlow estabilice antes de emitir

    return () => clearTimeout(timeout);
  }, [nodes, edges, onGraphChange]);


  /*useImperativeHandle(ref, () => ({
    getGraphData: () => ({ nodes, edges }),
    setGraphData: (newNodes, newEdges) => {
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }));*/

  useImperativeHandle(ref, () => ({
    getGraphData: () => ({ nodes, edges }),
    setGraphData: (newNodes, newEdges) => {
      setNodes(newNodes);
      setEdges(newEdges);
    },
    clearGraph: () => {
      setNodes([]);
      setEdges([]);
    }
  }));


  const handleCrearNodo = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const confirmarCrearNodo = () => {
    const label = inputRef.current?.value.trim();

    if (!label) {
      alert('El nombre del nodo no puede estar vacío.');
      return;
    }

    const existe = nodes.some(n => n.id === label);
    if (existe) {
      alert('Ya existe un nodo con ese nombre.');
      return;
    }

    const newNode = {
      id: label,
      type: 'circular',
      data: { 
        label,
        className: 'node-container'
       },
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setShowInput(false);
  };

  const cancelarCrearNodo = () => {
    setShowInput(false);
  };

  const eliminarNodo = () => {
    if (!selectedNodeId) {
      alert('Selecciona un nodo para eliminar.');
      return;
    }

    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
    );
    setSelectedNodeId(null);
  };

  // Conectar nodos
  const onConnect = useCallback((connection) => {
  setPendingConnection(connection);      // Guarda temporalmente la conexión
  setShowEdgeInput(true);                // Abre el input para el peso
  setTimeout(() => edgeInputRef.current?.focus(), 0);
}, []);

  const confirmarCrearArista = () => {
    const peso = edgeInputRef.current?.value.trim();

    if (!peso || isNaN(peso)) {
      alert('Por favor ingresa un número válido para el peso.');
      return;
    }

    const newEdge = {
      ...pendingConnection,
      label: peso,
      type: 'straight',
      markerEnd: undefined
    };

    setEdges((eds) => addEdge(newEdge, eds));
    setPendingConnection(null);
    setShowEdgeInput(false);
  };

  const cancelarCrearArista = () => {
    setPendingConnection(null);
    setShowEdgeInput(false);
  }

  const eliminarArista = () => {
    if (!selectedEdgeId) {
      alert('Selecciona una arista para eliminar.');
      return;
    }

    setEdges((edg) => edg.filter((e) => e.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  };

  // Guardar nodo seleccionado al hacer clic
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null)
  }, []);

  const onEdgeClick = useCallback((_, edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null)
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);


  const styledEdges = edges.map((e) => ({
    ...e,
    style: {
      stroke: e.id === selectedEdgeId ? '#e91e63' : '#888',
      strokeWidth: e.id === selectedEdgeId ? 4 : 2,
    },
  }));

  const styledNodes = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      className: n.id === selectedNodeId ? 'node-container selected' : 'node-container',
      label: n.data?.label || n.id
    }
  }));

  return (
    <div className='graph-container'>
      {botones &&
        <div className='graph-buttons'>
          <Button label='Crear Nodo' onClick={handleCrearNodo} />
          <Button label='Eliminar Nodo' onClick={eliminarNodo} />
          <Button label='Eliminar Arista' onClick={eliminarArista} />
          <Button label='Ver Datos' onClick={() => {
      console.log('NODOS:', nodes);
      console.log('ARISTAS:', edges);
    }} />
        </div>
      }

      {showInput && (
        <div className='graph-input-modal'>
          <Input
            text="Nombre del nodo:"
            placeholder="Ej: A"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmarCrearNodo();
              }
            }}
          />
          <div className='button-container'>
            <Button label="Confirmar" onClick={confirmarCrearNodo} />
            <Button label="Cancelar" onClick={cancelarCrearNodo} />
          </div>
        </div>
      )}

      {showEdgeInput && (
        <div className='graph-input-modal'>
          <Input
            text="Peso del enlace:"
            placeholder="Ej: 5"
            ref={edgeInputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmarCrearArista();
              }
            }}
          />
          <div className='button-container'>
            <Button label="Confirmar" onClick={confirmarCrearArista} />
            <Button label="Cancelar" onClick={cancelarCrearArista} />
          </div>
        </div>
      )}


      <ReactFlow
        nodeTypes={nodeTypes}
        //nodes={nodes}
        //edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        edges={styledEdges}
        nodes={styledNodes}

        onPaneClick={onPaneClick}
        
        connectionLineStyle={{ stroke: '#888', strokeWidth: 2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default forwardRef(Graph);