import React from "react";

const LoadingSpinner = ({
  isLoadingFullScreen = false,
}: {
  isLoadingFullScreen?: boolean;
}) => {
  return (
    <div
      className={`flex justify-center items-center h-full  ${
        isLoadingFullScreen ? "min-h-screen" : "min-h-[300px]"
      }`}
    >
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
