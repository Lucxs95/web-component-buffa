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

    .new-wrapper {
    grid-column: 3 / 4;  /* Position in the third column */
    grid-row: 2 / 3;    /* Position in the second row */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;  /* ensure it takes full height of its grid cell */
}
 




`;

export default styles;