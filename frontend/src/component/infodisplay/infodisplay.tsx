import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";

interface DotProps {
  active: boolean;
}
interface PicItem {
  key: number;
  src: string;
  alt: string;
}

const Imagecontainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;
const InfoDisplayPic = styled.img`
  width: 100%;
  object-fit: contain;
`;
const Sentencecontainer = styled.div`
  color: #070707;
  font-family: Noto Sans TC;
  font-style: normal;
  font-weight: 400;

  position: absolute;
  top: 60%;
  left: 30%;
  transform: translate(-50%, -50%);
  z-index: 1;
  white-space: pre-line;
`;
const Sentence = styled.div`
  font-size: 1rem;
  line-height: 2rem;
`;
const SenRef = styled.div`
  font-size: 0.5rem;
  line-height: 2rem;
`;
const Pic: PicItem[] = [
  {
    key: 1,
    src: "images/infodisplay.png",
    alt: "cloth",
  },
  {
    key: 2,
    src: "images/卡比.png",
    alt: "cloth",
  },
  {
    key: 3,
    src: "images/infodisplay.png",
    alt: "cloth",
  },
];

const SliderDots = styled.div`
  position: absolute;
  bottom: 1%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;
const Dot = styled.div<DotProps>`
  position: relative;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #d3d3d3;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  display: inline-block;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background-color: #a17c6b;
    z-index: 2;
    opacity: ${(props) => (props.active ? 1 : 0)};
  }
`;

function Infodisplay() {
  const [currenntPic, setCurrentPic] = useState(1);
  const [hovered, setHovered] = useState(false);

  // const next = (pic) => {
  // //   setPic((pic) => (pic = pic + 1));
  //   setPic(pic +1)
  // };

  //   const next = () => {
  //     setPic((pic) => (pic === Pic.length - 1 ? 0 : pic + 1));
  //   };

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!hovered) {
      timerId = setTimeout(() => {
        setCurrentPic((current) => (current === Pic.length ? 1 : current + 1));
      }, 2000);
    }
    return () => clearTimeout(timerId);
  }, [currenntPic, hovered]);

  //   setTimeout(() => {
  //     setCurrentPic((currenntPic) =>
  //       currenntPic === Pic.length ? 1 : currenntPic + 1
  //     );
  //   }, 2000);

  return (
    <div>
      <Imagecontainer>
        <InfoDisplayPic
          src={Pic[currenntPic - 1].src}
          alt="cloth"
        ></InfoDisplayPic>
        <Sentencecontainer>
          <Sentence>{`於是\n我也想要給你\n一個那麼美好的自己。`}</Sentence>
          <SenRef>不朽《與自己和好如初》</SenRef>
        </Sentencecontainer>
        <SliderDots>
          {Pic.map((pic) => (
            <Dot
              onClick={() => {
                setCurrentPic(pic.key);
              }}
              key={pic.key}
              active={currenntPic === pic.key}
              onMouseEnter={() => {
                setHovered(true);
              }}
              onMouseLeave={() => {
                setHovered(false);
              }}
            />
          ))}
        </SliderDots>
      </Imagecontainer>
    </div>
  );
}
export default Infodisplay;
