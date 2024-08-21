import React, { useRef } from 'react';
import { Camera } from 'react-camera-pro';

const CameraComponent = () => {
  const cameraRef = useRef(null);

  const takePhoto = () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      console.log(photo);
      // You can now use the photo, e.g., send it to a server or display it in the UI
    }
  };

  return (
    <div>
      <Camera ref={cameraRef} aspectRatio={16 / 9} />
      <button onClick={takePhoto}>Take Photo</button>
    </div>
  );
};

export default CameraComponent;