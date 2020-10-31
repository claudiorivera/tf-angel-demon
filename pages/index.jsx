import Fire from "@components/Fire";
import Heart from "@components/Heart";
import * as tmImage from "@teachablemachine/image";
import { useEffect, useState } from "react";

const IndexPage = () => {
  const dark = "bg-black text-white";
  const light = "bg-pink-400 text-white";
  const neutral = "bg-white text-black";
  let model, webcam, maxPredictions;
  const [showStartButton, setShowStartButton] = useState(true);
  const [bgColor, setBgColor] = useState(neutral);
  const [showFlames, setShowFlames] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    switch (bgColor) {
      case dark:
        handleDark();
        break;
      case light:
        handleLight();
        break;
      default:
        handleNeutral();
    }
  }, [bgColor]);

  const handleDark = () => {
    setShowHearts(false);
    setShowFlames(true);
  };

  const handleLight = () => {
    setShowHearts(true);
    setShowFlames(false);
  };

  const handleNeutral = () => {
    setShowHearts(false);
    setShowFlames(false);
  };

  const handleStart = () => {
    setShowStartButton(false);
    start();
  };

  const start = async () => {
    const URL = "/tm-model/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-view").appendChild(webcam.canvas);
  };

  const loop = async () => {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
  };

  // run the webcam image through the image model
  const predict = async () => {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      if (prediction[i].probability.toFixed(2) > 0.5) {
        setBgColor(
          prediction[i].className === "Rachel"
            ? dark
            : prediction[i].className === "Oliver"
            ? light
            : neutral
        );
      }
    }
  };

  return (
    <div className="center font-thin">
      <div className={"h-screen " + bgColor}>
        <div className="flex justify-center flex-wrap items-baseline">
          <div className="px-3 angel">Angel</div>
          <div className="px-5 text-3xl">or</div>
          <div className="px-3 demon">Demon</div>
        </div>
        <div>
          {showStartButton && (
            <button
              className="bg-accent-1 text-white font-bold py-2 px-4 rounded"
              onClick={handleStart}
            >
              Start
            </button>
          )}
        </div>
        <div className="flex flex-row justify-evenly align-baseline">
          {showFlames && <Fire />}
          {showHearts && <Heart />}
          <div id="webcam-view" className="my-20"></div>
          {showFlames && <Fire />}
          {showHearts && <Heart />}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
