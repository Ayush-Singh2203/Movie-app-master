import React, { useEffect, useState } from "react";
import { API_URL, API_KEY, IMAGE_URL } from "../../Config";
import MainImage from "../LandingPage/Sections/MainImage";

import GridCard from "../LandingPage/Sections/GridCard";

import { Descriptions, Button, Row } from "antd";
import Favorite from "./Sections/Favorite";

import axios from "axios";

import Comments from "./Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";

function MovieDetailPage(props) {
  const movieId = props.match.params.movieId; // getting the movieId from URL parameters

  const [Movie, setMovie] = useState([]);
  const [Crews, setCrews] = useState([]);
  const [ActorToggle, setActorToggle] = useState(false);

  const [CommentLists, setCommentLists] = useState([]);
  const [LoadingForMovie, setLoadingForMovie] = useState(true);
  const [LoadingForCasts, setLoadingForCasts] = useState(true);

  useEffect(() => {
    let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    fetchDetailInfo(endpointForMovieInfo);

    axios
      .post("/api/comment/getComments", { movieId: movieId })
      .then((response) => {
        //console.log(response.data);
        if (response.data.success) {
          // console.log("response.data.comments", response.data.comments);
          setCommentLists(response.data.comments);
        } else {
          alert("Failed to get comments Info");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchDetailInfo = (endpoint) => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setMovie(res);
        setLoadingForMovie(false);

        // for crew members
        fetch(`${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`)
          .then((res) => res.json())
          .then((res) => {
            //console.log(res);
            setCrews(res.cast);
          });
        setLoadingForCasts(false);
      });
  };

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  const handleClick = () => {
    setActorToggle(!ActorToggle);
  };

  return (
    <div>
      {!LoadingForMovie ? (
        Movie && (
          <MainImage
            image={`${IMAGE_URL}w1280${
              Movie.backdrop_path && Movie.backdrop_path
            }`}
            title={Movie.original_title}
            text={Movie.overview}
          />
        )
      ) : (
        <div>Loading...</div>
      )}

      {/* Body */}
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* if logged in userId is stored in local storage */}
          <Favorite
            userFrom={localStorage.getItem("userId")}
            movieId={movieId}
            movieInfo={Movie}
          />
        </div>

        {/* Movie Info Table */}
        {!LoadingForMovie ? (
          <Descriptions title="Movie Info" bordered>
            <Descriptions.Item label="Title">
              {Movie.original_title}
            </Descriptions.Item>
            <Descriptions.Item label="release_date">
              {Movie.release_date}
            </Descriptions.Item>
            <Descriptions.Item label="revenue">
              {Movie.revenue}
            </Descriptions.Item>
            <Descriptions.Item label="runtime">
              {Movie.runtime}
            </Descriptions.Item>
            <Descriptions.Item label="vote_average" span={2}>
              {Movie.vote_average}
            </Descriptions.Item>
            <Descriptions.Item label="vote_count">
              {Movie.vote_count}
            </Descriptions.Item>
            <Descriptions.Item label="status">{Movie.status}</Descriptions.Item>
            <Descriptions.Item label="popularity">
              {Movie.popularity}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleClick}> Toggle Actor View</Button>
      </div>
      <br />

      {/* Grid card for crews */}
      {ActorToggle && (
        <Row gutter={[16, 16]}>
          {!LoadingForCasts ? (
            Crews &&
            Crews.map((crew, index) => (
              <React.Fragment key={index}>
                {crew.profile_path && (
                  <GridCard
                    actor
                    image={`${IMAGE_URL}w500${crew.profile_path}`}
                    alt={crew.character}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <div>loading...</div>
          )}
        </Row>
      )}

      {/* Comments */}
      <br />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <LikeDislikes
          video
          videoId={movieId}
          userId={localStorage.getItem("userId")}
        />
      </div>

      {/* Comments */}
      <Comments
        movieTitle={Movie.original_title}
        CommentLists={CommentLists}
        movieId={movieId}
        refreshFunction={updateComment}
      />
    </div>
  );
}

export default MovieDetailPage;
