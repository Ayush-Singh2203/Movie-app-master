import React from "react";
import { Col } from "antd";

function GridCard(props) {
  if (props.actor) {
    return (
      <div>
        <Col lg={6} md={8} xs={24}>
          <div style={{ position: "relative" }}>
            {/* make this movieId route in App.js also */}

            <img
              style={{ width: "100%", height: "320px" }}
              alt={props.alt}
              src={props.image}
            />
          </div>
        </Col>
      </div>
    );
  } else {
    return (
      <Col lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          {/* make this movieId route in App.js also */}
          <a href={`/movie/${props.movieId}`}>
            <img
              style={{ width: "100%", height: "320px" }}
              alt={props.alt}
              src={props.image}
            />
          </a>
        </div>
      </Col>
    );
  }
}

export default GridCard;
