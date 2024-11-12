import React, { useEffect, useState } from "react";
import { Button, Icon } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

import { StarOutlined, StarFilled } from "@ant-design/icons";

function Favorite(props) {
  const user = useSelector((state) => state.user);

  const [FavoriteNumber, setFavoriteNumber] = useState(0);
  const [Favorited, setFavorited] = useState(false);

  const variable = {
    userFrom: props.userFrom,
    movieId: props.movieId,
    movieTitle: props.movieInfo.original_title,
    movieImage: props.movieInfo.backdrop_path,
    movieRunTime: props.movieInfo.runtime,
  };

  useEffect(() => {
    axios.post("/api/favorite/favoriteNumber", variable).then((res) => {
      if (res.data.success) {
        setFavoriteNumber(res.data.favoriteNumber);
      } else {
        alert("Failed to get Favorites Info");
      }
    }, []);

    // to check if already added to favorite
    axios.post("/api/favorite/favorited", variable).then((res) => {
      if (res.data.success) {
        setFavorited(res.data.favorited);
      } else {
        alert("Failed to get Favorites Info");
      }
    });
  }, []);

  const onClickFavorite = () => {
    if (user.userData && !user.userData.isAuth) {
      return alert("Please Log in first");
    }

    if (Favorited || FavoriteNumber > 0) {
      // when already added
      axios.post("/api/favorite/removeFromFavorite", variable).then((res) => {
        if (res.data.success) {
          setFavoriteNumber(0);
          setFavorited(!Favorited);
          //console.log(FavoriteNumber, Favorited);
        } else {
          alert("Failed to remove from Favorites");
        }
      });
    } else if (FavoriteNumber === 0) {
      // when not adding yet
      axios.post("/api/favorite/addToFavorite", variable).then((res) => {
        if (res.data.success) {
          setFavoriteNumber(FavoriteNumber + 1);
          setFavorited(!Favorited);
        } else {
          alert("Failed to add to Favorites");
        }
      });
    }
  };

  return (
    <div>
      <Button
        onClick={onClickFavorite}
        class="mdc-icon-button"
        aria-label="Add to favorites"
        aria-pressed="false"
      >
        {FavoriteNumber !== 0 ? (
          <StarFilled style={{ color: "gold", fontSize: "20px" }} />
        ) : (
          <StarOutlined style={{ color: "red", fontSize: "15px" }} />
        )}
      </Button>
      <i class="icon-heart"></i>
    </div>
  );
}

export default Favorite;
