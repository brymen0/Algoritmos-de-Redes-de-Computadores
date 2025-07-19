import Graph from "../components/Graph";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useEffect, useRef, useState } from "react";
import './EstadoEnlacePage.css'
import TablaEnlaces from "../components/TablaEnlaces";
import { estadoEnlace } from "../logic/EstadoEnlace";

function EstadoEnlacePage() {
  const topologyGraphRef = useRef();

  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [peso, setPeso] = useState('');
  const [mostrarGrafo, setMostrarGrafo] = useState(false);
  const [enlacesPorOrigen, setEnlacesPorOrigen] = useState({});

  const onClickAggEnlace = () => {
    const origenL = origen.trim();
    const destinoL = destino.trim();

    if (!origenL || !destinoL || !peso) {
      alert("Debe llenar todos los campos");
      return;
    }

    if (isNaN(peso)) {
      alert("Ingrese un peso válido");
      return;
    }

    const enlaceExistente = enlacesPorOrigen[origenL]?.some(enlace => enlace.destino === destinoL);

    if (enlaceExistente){
      alert("El enlace de "+origenL+" a "+destinoL+" ya existe")
      return
    }
    setEnlacesPorOrigen(prev => {
      const newEnlaces = prev[origenL] ? [...prev[origenL]] : [];
      newEnlaces.push({destino:destinoL, peso});

      return {
        ...prev,
        [origenL]: newEnlaces
      };
    });
    limpiarCampos();
  }

  const onChangeOrigen = (e) => {
    setOrigen(e.target.value)
  }

  const onChangeDestino = (e) => {
    setDestino(e.target.value)
  }

  const onChangePeso = (e) => {
    setPeso(e.target.value)
  }

  useEffect(() => {
  if (mostrarGrafo && topologyGraphRef.current) {
    const resultado = estadoEnlace(enlacesPorOrigen);
    topologyGraphRef.current.setGraphData(resultado.nodes, resultado.edges);
  }
}, [mostrarGrafo]);

  const onClick = () => {
  {/*const resultado = estadoEnlace(enlacesPorOrigen);
  console.log("Resultado: ",resultado)
  console.log("Nodos ",resultado.nodes)
  console.log("Enlaces ",resultado.edges)
  if (topologyGraphRef.current && resultado) {
    topologyGraphRef.current.setGraphData(resultado.nodes, resultado.edges);
  }else {
    console.log("Graph ref no está disponible o resultado inválido");
  }*/}

  setMostrarGrafo(true);
};


  const limpiarCampos = () => {
    setDestino('');
    setOrigen('');
    setPeso('');
  }

  const onClickLimpiarTodo = () => {
    limpiarCampos()
    setMostrarGrafo(false)
    setEnlacesPorOrigen({})
  }

  return (
    <div className="estado-enlace-container">
      <h1>Enrutamiento por Estado del Enlace</h1>
      <div className="info-enlaces">
        <Input text="Nodo origen:" placeholder="Ej: A" value={origen} onChange={onChangeOrigen}></Input>
        <Input text="Nodo destino:" placeholder="Ej: B" value={destino} onChange={onChangeDestino}></Input>
        <Input text="Peso:" placeholder="Ej: 5" value={peso} onChange={onChangePeso} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onClickAggEnlace();
              }
            }}></Input>
        <Button label="Agregar enlace" onClick={onClickAggEnlace} />
      </div>
      <div className="tablas-container">
        {Object.entries(enlacesPorOrigen).map(([origen, enlaces]) => (
          <TablaEnlaces key={origen} origen={origen} enlaces={enlaces}/>
        ))}
      </div>
      <div className="buttons-container">
        <Button label='Generar topología' onClick={onClick}></Button>
        <Button label='Limpiar' onClick={onClickLimpiarTodo}></Button>
      </div>
      {mostrarGrafo && 
        <div className="graph-topology-container">
          <Graph ref={topologyGraphRef} botones={false}></Graph>
        </div>
      }
    </div>
  );
}

export default EstadoEnlacePage;
