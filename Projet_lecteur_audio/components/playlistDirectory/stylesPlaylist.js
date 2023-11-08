const styles = `

    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Georama', sans-serif;
}

    body {
    background-color: rgb(31, 31, 31);
    overflow: hidden;
}

    .playlist-wrapper {
    display: flex;
    flex-direction: column; /* This makes the content flow vertically */
    justify-content: flex-start; /* Align the content to the top */
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
    margin: auto;
}

    .playlist__song {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: rgba(31, 31, 31, 0.7);
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
}

    .playlist__song:hover {
    background-color: rgba(31, 31, 31, 0.9);
}

    .playlist__song-cover {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 15px;
}

    .playlist__song-info {
    flex-grow: 1;
}

    .playlist__song-title {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 5px;
}

    .playlist__song-artist {
    color: rgba(255, 255, 255, 0.5);
}

    .playlist__song-play,.playlist__song-add {
    padding: 5px 10px;
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

    .playlist__song-play:hover,.playlist__song-add:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

    .playlist::-webkit-scrollbar {
    width: 10px; /* width of the scrollbar */
}

    .playlist {
    max-height: 100vh;  /* Set a maximum height */
    direction: rtl;
    overflow-y: auto;  /* Set overflow to auto for vertical scrolling */
    width: 100%;       /* Ensure it takes full width */
    padding: 0px;     /* Some padding for aesthetics */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
}

    .playlist-content {
    direction: ltr; /* revert the direction */
    width: 98%; /* slightly less than 100% to fit within the extra space in .playlist */
    float: right; /* push the content to the right side */
    max-height: 400px; /* for example, limit the height to 400px */
}

    .playlist__title {
    font-size: 24px;  /* Setting a font size */
    font-weight: bold; /* Making the text bold */
    color: #ffffff;  /* Setting a text color */
    margin-bottom: 20px;  /* Giving some space below the title */
    text-align: center;  /* Center aligning the text */
    text-transform: uppercase; /* Making the text uppercase */
}
`;

export default styles;