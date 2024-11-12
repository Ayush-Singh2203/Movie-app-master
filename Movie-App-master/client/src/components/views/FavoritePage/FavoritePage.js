import React, { useEffect, useState } from "react";
import "./favorite.css";
import Axios from "axios";
import { Popover } from "antd";
import { useSelector } from "react-redux";
import { IMAGE_URL } from "../../Config";

function FavoritePage() {
  const user = useSelector((state) => state.user);

  let variables = { userFrom: localStorage.getItem("userId") };

  const [FavoritedMovies, setFavoritedMovies] = useState([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoredMovie();
  }, []);

  const fetchFavoredMovie = () => {
    Axios.post("/api/favorite/getFavoritedMovie", variables).then((res) => {
      if (res.data.success) {
        // console.log(res.data.favorites);
        setFavoritedMovies(res.data.favorites);
        setLoading(false);
      } else {
        alert("Failed to get favorited videos");
      }
    });
  };

  const onClickRemove = (movieId, userFrom) => {
    const variables = {
      movieId: movieId,
      userFrom: userFrom,
    };

    Axios.post("/api/favorite/removeFromFavorite", variables).then(
      (response) => {
        if (response.data.success) {
          fetchFavoredMovie(); // to re render
        } else {
          alert("Failed to Remove From Favorite");
        }
      }
    );
  };

  const renderTableBody = FavoritedMovies.map((favorite, index) => {
    //console.log(`${IMAGE_URL}w500${favorite.movieImage}`);
    const content = (
      <div>
        {favorite.movieImage ? (
          <img src={`${IMAGE_URL}w500${favorite.movieImage}`} />
        ) : (
          "no image"
        )}
      </div>
    );

    return (
      <tr key={index}>
        <Popover content={content} title={`${favorite.movieTitle}`}>
          <td>{favorite.movieTitle}</td>
        </Popover>

        <td>{favorite.movieRunTime} mins</td>
        <td>
          <button
            onClick={() => onClickRemove(favorite.movieId, favorite.userFrom)}
          >
            {" "}
            Remove{" "}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h3>Favorite Movies By Me</h3>
      <hr />

      {user.userData && !user.userData.isAuth ? (
        <div
          style={{
            width: "100%",
            fontSize: "2rem",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Please Log in first...</p>
          <a href="/login">Go to Login page</a>
        </div>
      ) : (
        !Loading && (
          <table>
            <thead>
              <tr>
                <th>Movie Title</th>
                <th>Movie Runtime</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>{renderTableBody}</tbody>
          </table>
        )
      )}
    </div>
  );
}

export default FavoritePage;
