import React, { useEffect, useState } from "react";
import { API_URL, API_KEY, IMAGE_URL } from "../../Config";
import MainImage from "./Sections/MainImage";
import GridCard from "./Sections/GridCard";

import { Typography, Row } from "antd";
const { Title } = Typography;

function LandingPage() {
  const [Movies, setMovies] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    fetchMovies(endpoint);
  }, []);

  const fetchMovies = (path) => {
    fetch(path)
      .then((response) => response.json())
      .then((response) => {
        //console.log(response);
        setMovies([...Movies, ...response.results]); // we used array so that when we click load more we can concat the new page in that part instead of replacing it
        setCurrentPage(response.page);
      });
  };

  const handleClick = () => {
    // here we want to add the pages in the fetch API that we used ( US&page=2)
    let endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
      CurrentPage + 1
    }`;
    fetchMovies(endpoint);
  };

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {/* Movie Main Image ... w1280 is wide 1280 size of image 
      and we are doing && as rendering speed is faster so to ensure the first we fetch*/}
      {Movies[0] && (
        <MainImage
          image={`${IMAGE_URL}w1280${
            Movies[0].backdrop_path && Movies[0].backdrop_path
          }`}
          title={Movies[0].original_title}
          text={Movies[0].overview}
        />
      )}

      {/* BODY */}
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <Title level={2}> Movies by latest</Title>
        <hr />

        {/* Grid Cards */}
        <Row gutter={[16, 16]}>
          {Movies &&
            Movies.map((movie, index) => (
              <React.Fragment key={index}>
                <GridCard
                  image={
                    movie.poster_path && `${IMAGE_URL}w500${movie.poster_path}`
                  }
                  alt={movie.character}
                  movieId={movie.id}
                />
              </React.Fragment>
            ))}
        </Row>

        {/* Load more Button */}
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleClick}>Load More</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
