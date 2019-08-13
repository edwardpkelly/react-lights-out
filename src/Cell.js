import React from 'react'
import "./Cell.css"


const Cell = props => {

  const handleClick = evt => {
    const {
      flipCellsAroundMe,
      coords
    } = props;

    flipCellsAroundMe(coords);
  }
  let classes = props.isLit ? "Cell-lit" : "Cell-dark";

  return (
    <td className="Cell" onClick={handleClick}>
      <div className={classes} />
    </td>
  );
}

export default Cell;