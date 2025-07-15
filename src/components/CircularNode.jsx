import './CircularNode.css'
import { Handle, Position } from 'reactflow';
import React from 'react';

export const CircularNode = React.memo(function CircularNode({ data }) {
  return (
    <div className={data.className}>
      {data.label}
      <Handle type="target" position={Position.Top} className='punto-union'/>
      <Handle type="source" position={Position.Bottom} className='punto-union' />
    </div>
  );
});
