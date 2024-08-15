"use server"


export async function sendToKitchen() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const blank = document.createElement("canvas");
  blank.width = canvas.width;
  blank.height = canvas.height;

  if (
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.toString() ===
    blank
      .getContext("2d")
      .getImageData(0, 0, blank.width, blank.height)
      .data.toString()
  ) {
    alert("Canvas is blank. Please draw something before sending.");
    return;
  }

  const imageData = canvas.toDataURL("image/png");
  console.log(imageData);
}


export default sendToKitchen;