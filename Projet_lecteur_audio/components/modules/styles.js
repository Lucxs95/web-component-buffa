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

    .section {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* 3 columns */
    grid-template-rows: 1fr 1fr;         /* 2 rows */
    gap: 20px;                           /* Gap between grid items */
    padding: 10px;                       /* Some padding around */
}

    .section__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

    .section__background:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: rgba(31, 31, 31, .8);
    height: 100vh;
    backdrop-filter: blur(20px);
    z-index: 11;
}
    }

    .section__background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

    .music-card {
    position: relative;
    max-width: 400px;    /* Increase the maximum width */
    width: 100%;
    height: 480px;      /* Reduce the height to make it more rectangular */
    border-radius: 25px;
    transform-style: preserve-3d;
    transition: all .2s linear;
    z-index: 2;
}

    .music-card.right-weight {
    transform: rotateY(4deg) rotateX(-5deg);
}

    .music-card.middle-weight {
    transform: rotateY(0) rotateX(-5deg);
}

    .music-card.left-weight {
    transform: rotateY(-4deg) rotateX(-5deg);
}


    .music-card__content {
    padding-bottom: 20px;
}

    .music-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    z-index: -1;
}

    .music-image {
    position: relative;
    width: 400px;       /* Adjust width to fit inside the new card size */
    height: 260px;      /* Adjust height to fit inside the new card size */
    padding: 10px;
    border-radius: 20px;
    object-fit: cover;
    filter: drop-shadow(-20px 10px 10px rgba(0, 0, 0, 0.25));
}

    .music-image.animate {
    animation-name: coverAnimate;
    animation-duration: .3s;
    animation-iteration-count: 1;
    animation-direction: alternate;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
}

    .music-info {
    padding-inline: 20px;
}

    .music-name {
    font-size: 1.4em;
    color: rgba(255, 255, 255, .8);
    margin-bottom: 4px;
    line-height: 1;
}

    .music-artist {
    font-size: 1em;
    color: rgba(255, 255, 255, .5);
}

    .music-controls {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0px;
    margin-inline: auto;
    width: 270px;
}

    .music-controls-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    transition: ease-in-out .2s;
}

    .play-icon-background {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #a5a5a5;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .25));
    transition: all .2s;
}

    .music-controls-item#play .play-icon {
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, .3));
    transition: all .2s;
}

    .music-controls-item#play:hover .play-icon-background {
    animation-name: playIconBackgroundAnimate;
    animation-duration: .3s;
    animation-iteration-count: 1;
    opacity: 1;
}

    .music-controls-item#play:hover .play-icon {
    animation-name: playIconAnimate;
    animation-duration: .3s;
    animation-iteration-count: 1;
}

    .music-controls-item:hover:not(#play) {
    background: #a5a5a5;
}

    .music-controls-item--icon {
    font-size: 1.2em;
    color: #fff;
}

    .music-progress {
    position: relative;
    width: calc(100% - 40px);
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    cursor: pointer;
}

    .music-progress-bar {
    position: relative;
    width: 0;
    height: 5px;
    border-radius: 5px;
    background-color: #fff;
}

    .music-progress-bar:after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 1);
    filter: drop-shadow(0px 0px 4px rgba(46, 45, 45, 1));
    border-radius: 50%;
    box-sizing: border-box;
}

    .music-progress:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 5px;
    background: rgba(255, 255, 255, .3);
    border-radius: 5px;
    z-index: -1;
}

    .music-progress__time {
    position: absolute;
    top: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

    .music-progress__time-item {
    color: #fff;
    font-size: 12px;
    opacity: .4;
}

    @keyframes coverAnimate {
    0% {
        transform: scale(1);
    }
    50% {
    transform: scale(0.98);
}
    100% {
    transform: scale(1);
}
}

    @-webkit-keyframes coverAnimate {
    0% {
        transform: scale(1);
    }
    50% {
    transform: scale(0.98);
}
    100% {
    transform: scale(1);
}
}

    @keyframes playIconAnimate {
    0% {
        transform: scale(1);
    }
    20% {
    transform: scale(1);
}
    85% {
    transform: scale(1.2);
}
    100% {
    transform: scale(1);
}
}

    @keyframes playIconBackgroundAnimate {
    0% {
        opacity: 1;
        transform: scale(0.7);
        filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .1));
}
    65% {
    transform: scale(1.1);
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .25));
}
    85% {
    transform: scale(1);
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .18));
    opacity: 1;
}
    100% {
    transform: scale(1);
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, .18));
    opacity: 1;
}
}

    @media screen and (max-width: 480px) {
    .music-image {
    width: 100%;
    max-width: calc(100% - 40px);
    margin: 20px;
    left: unset;
    top: unset;
    height: 360px;
    border-radius: 12px;
    filter: drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.20));
}
    .music-card {
    width: 100%;
    max-width: calc(100% - 20px);
    margin-inline: auto;
}
}

    .music-controls-item:hover,
    .music-controls-item.active {
    background-color: rgba(0, 0, 0, 0.1); /* Example shade */
    cursor: pointer;
}

    .music-controls-item--icon.active {
    color: #007BFF; /* Example blue color */
}

    .volume-controls {
    position: relative;
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    cursor: pointer;
}

    .volume-icon {
    margin-right: 10px;
    color: #fff;
}

    #volumeSlider {
    position: relative;
    width: calc(100% - 30px);
    height: 5px;
    margin: 0;  /* Reset the margin */
    padding: 0;  /* Reset the padding */
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    vertical-align: middle; /* Center the thumb vertically */
}

    #volumeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -5px;  /* Adjust margin to center the thumb on the track */
}




    #volumeSlider::-webkit-slider-runnable-track {
    height: 5px;
    border-radius: 5px;
    background-color: #fff;
}




    .playlist-wrapper {
    grid-column: 1 / 2;  /* Position in the first column */
    grid-row: 1 / 2;    /* Position in the first row */
    display: flex;
    flex-direction: column; /* This makes the content flow vertically */
    justify-content: flex-start; /* Align the content to the top */
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
    margin: auto;
}

    .music-card__wrapper {
    grid-column: 2 / 3;  /* Position in the second column */
    grid-row: 1 / 2;    /* Position in the first row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
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
    .mixTable-wrapper {
    grid-column: 2 / 3;  /* Position in the second column */
    grid-row: 2 / 2;    /* Position in the second row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
}
    .new-wrapper {
    grid-column: 3 / 4;  /* Position in the third column */
    grid-row: 2 / 3;    /* Position in the second row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
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


    /* Styling the scrollbar for WebKit browsers */
    .playlist::-webkit-scrollbar, .queue::-webkit-scrollbar{
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

    .queue {
    max-height: 100vh;  /* Set a maximum height */

    overflow-y: auto;  /* Set overflow to auto for vertical scrolling */
    width: 100%;       /* Ensure it takes full width */
    padding: 0px;     /* Some padding for aesthetics */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
}


    .playlist-content, .queue-content {
    direction: ltr; /* revert the direction */
    width: 98%; /* slightly less than 100% to fit within the extra space in .playlist */
    float: right; /* push the content to the right side */
    max-height: 400px; /* for example, limit the height to 400px */
}


    .playlist__title , .queue__title {
    font-size: 24px;  /* Setting a font size */
    font-weight: bold; /* Making the text bold */
    color: #ffffff;  /* Setting a text color */
    margin-bottom: 20px;  /* Giving some space below the title */
    text-align: center;  /* Center aligning the text */
    text-transform: uppercase; /* Making the text uppercase */
}

    .music-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 150px; /* or any other appropriate size */
        text-align: center;
        color: #aaa; /* placeholder text color */
        background-color: #f4f4f4; /* placeholder background */
        border: 1px dashed #ccc; /* optional: placeholder border */
}

`;

export default styles;