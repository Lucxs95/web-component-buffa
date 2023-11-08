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

    .mixTable-wrapper {
    grid-column: 2 / 3;  /* Position in the second column */
    grid-row: 2 / 2;    /* Position in the second row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
}


`;

export default styles;