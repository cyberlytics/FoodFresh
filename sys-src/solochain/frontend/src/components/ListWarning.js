import React from 'react';
import { yellow10 } from "@carbon/colors";
import { Warning24 } from "@carbon/icons-react";
import { Tile } from "carbon-components-react";

export default function Main(props) {
  return (
    <Tile light style={{ backgroundColor: yellow10 }}>
      <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "4px"}}>
        <Warning24 style={{marginRight: "8px"}}/>
        <p>{props.message}</p>
      </div>
    </Tile>
  );
}

