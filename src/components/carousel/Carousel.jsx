import "./carousel.css";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Fragment, useContext, useRef } from "react";
import { AppContext } from "../../store/Store";

export default function MainCarousel() {
  const { banner } = useContext(AppContext);

  const carouselRef = useRef();

  const handlePrev = () => {
    carouselRef.current.prev();
  };

  const handleNext = () => {
    carouselRef.current.next();
  };

  return (
    <Fragment>
      <div style={{ position: "relative" }}>
        <div className="carousel-arrow-left" onClick={() => handlePrev()}>
          <LeftOutlined />
        </div>
        <div className="carousel-arrow-right" onClick={() => handleNext()}>
          <RightOutlined />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "980px" }}>
          <Carousel autoplay dots={{ className: "dot" }} ref={carouselRef}>
            {banner.map((item, idx) => {
              return (
                <a href={item.url} key={idx}>
                  <img
                    src={item.imageUrl}
                    width="980px"
                    height="363px"
                    alt="轮播图"
                  />
                </a>
              );
            })}
          </Carousel>
        </div>
      </div>
    </Fragment>
  );
}
