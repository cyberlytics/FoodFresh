import React from "react";
import { Grid, ToastNotification } from "carbon-components-react";
import TopNavMenuSkeleton from "./TopNavMenuSkeleton";

export default function DefaultSkeleton (props) {

  const { loading, toast } = props

  return (
    <div>
      <TopNavMenuSkeleton />
      <Grid>
        <br/><br/>
      </Grid>
      {!loading
        ?
        <ToastNotification
          title={toast.title}
          caption={toast.caption}
          style={{ position: 'fixed', bottom: '0%'}}
        /> : null
      }
    </div>
  );
}