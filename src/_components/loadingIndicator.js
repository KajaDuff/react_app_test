
import Loader from 'react-loader-spinner'
import React from 'react'

export default function LoadingIndicator () {
  //const { promiseInProgress } = usePromiseTracker();
  return (
   // promiseInProgress && 
    <div
      style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Loader type="ThreeDots" color="#0D47A1" height="100" width="100" />
    </div>
  );
}