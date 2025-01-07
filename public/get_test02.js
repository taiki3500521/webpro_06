const addbutton = document.querySelector('#add');
const display = document.querySelector('#answer');

addbutton.addEventListener('click', () => {
    fetch( "/add?num1=2&num2=3" )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        display.value = response.answer;
        console.log( response );
    })
})