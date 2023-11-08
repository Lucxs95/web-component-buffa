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

    .queue-wrapper {
    grid-column: 3 / 4;  /* Position in the third column */
    grid-row: 1 / 2;    /* Position in the first row */
    display: flex;
    flex-direction: column; /* This makes the content flow vertically */
    justify-content: flex-start; /* Align the content to the top */
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
    margin: auto;
}

    .queue__song {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: rgba(31, 31, 31, 0.7);
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
}

    .queue__song:hover {
    background-color: rgba(31, 31, 31, 0.9);
}

    .queue__song-cover {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 15px;
}

    .queue__song-info {
    flex-grow: 1;
}

    .queue__song-title {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 5px;
}

    .queue__song-artist {
    color: rgba(255, 255, 255, 0.5);
}

    .queue__song-play,.queue__song-add {
    padding: 5px 10px;
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

    .queue__song-play:hover,.queue__song-add:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

     .queue::-webkit-scrollbar{
    width: 10px; /* width of the scrollbar */
}

    .queue {
    max-height: 100vh;  /* Set a maximum height */

    overflow-y: auto;  /* Set overflow to auto for vertical scrolling */
    width: 100%;       /* Ensure it takes full width */
    padding: 0px;     /* Some padding for aesthetics */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
}

    .queue-content {
    direction: ltr; 
    width: 98%; 
    float: right; 
    max-height: 400px; 
}

    .queue__title {
    font-size: 24px;  /* Setting a font size */
    font-weight: bold; /* Making the text bold */
    color: #ffffff;  /* Setting a text color */
    margin-bottom: 20px;  /* Giving some space below the title */
    text-align: center;  /* Center aligning the text */
    text-transform: uppercase; /* Making the text uppercase */
}
`;

export default styles;