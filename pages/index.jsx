import Button from "@components/Button";
import Fire from "@components/Fire";
import Heart from "@components/Heart";
import Hero from "@components/Hero";
import * as tmImage from "@teachablemachine/image";
import { useEffect, useState } from "react";

const dark = "bg-black text-white";
const light = "bg-pink-400 text-white";
const neutral = "bg-white text-black";
let model, webcam, maxPredictions;

const IndexPage = () => {
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
    <div className="center">
      <div className={bgColor + " h-screen"}>
        <Hero>
          <h1>
            <span className="angel">Angel</span> &amp;{" "}
            <span className="demon">Demon</span>
          </h1>
        </Hero>
        <div>
          {showStartButton && <Button onClick={handleStart}>Start</Button>}
        </div>
        <div className="flex flex-row justify-evenly align-baseline">
          {showFlames && <Fire />}
          {showHearts && <Heart />}
          <div id="webcam-view"></div>
          {showFlames && <Fire />}
          {showHearts && <Heart />}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
