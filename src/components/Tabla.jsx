import './Tabla.css';

export function Tabla({ headers, data }) {
  return (
    <table className="tabla">
      <thead>
        <tr>
          {headers.map((titulo, index) => (
            <th key={index}>{titulo}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((fila, i) => (
          <tr key={i}>
            {fila.map((celda, j) => (
              <td key={j}>{celda}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
