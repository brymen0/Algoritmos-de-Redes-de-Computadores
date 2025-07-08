import './Division.css';

export function Division({ pasos }) {
  return (
    <div className="division-visual">
      <h3>Pasos de la división CRC</h3>
      <table>
        <thead>
          <tr>
            <th>Paso</th>
            <th>CRC actual</th>
            <th>Operando (XOR con)</th>
            <th>Bit siguiente</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {pasos.map((p, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{p.dividendo.join('')}</td>
              <td>{p.divisor.join('')}</td>
              <td>{p.bitSiguiente ?? '-'}</td>
              <td>{p.resultado.join('')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
    