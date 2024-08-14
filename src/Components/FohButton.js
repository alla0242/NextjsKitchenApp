import React from "react";
import axios from "axios";

const FohButton = ({
    height,
    width,
    onSendToKitchen
}) => {

    const [loading, setLoading] = React.useState(false);

    function sendToKitchen() {
        setLoading(true);
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;

        if (ctx.getImageData(0, 0, canvas.width, canvas.height).data.toString() === blank.getContext('2d').getImageData(0, 0, blank.width, blank.height).data.toString()) {
            alert('Canvas is blank. Please draw something before sending.');
            setLoading(false);
            return;
        }

        const imageData = canvas.toDataURL('image/png');
        axios.post("/api/saveImage", { imageData })
            .then((response) => {
                console.log("Success:", response.data);
                alert('Order sent to kitchen successfully!');
                clearCanvas();
                onSendToKitchen(); // Hide the order form
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to send order to kitchen');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function clearCanvas() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return (
      <div>
        <button
          height={height}
          width={width}
          id={"sendToKitchenButton"}
          onClick={sendToKitchen}
          disabled={loading}
          className="large-button"
        >
          {loading ? "Sending..." : "Send to Kitchen"}
        </button>
        <button
          height={height}
          width={width}
          onClick={clearCanvas}
          id={"clearButton"}
          disabled={loading}
          className="large-button"
        >
          Clear
        </button>
      </div>
    );
}

export default FohButton