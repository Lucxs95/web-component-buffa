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

    .section__background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}




`;

export default styles;