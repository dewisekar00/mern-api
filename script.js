const getButton = document.getElementById('get');
const postButton = document.getElementById('post');

getButton.addEventListener('click', () => {
  fetch('http://localhost:3000/v1/customer/products')
    .then(res => res.json())
    .then(resJSON => console.log(resJSON))
    .catch(err => console.log(err));
}); 

postButton.addEventListener('click', () => {
  fetch('http://localhost:3000/v1/customer/product')
    .then(res => res.json())
    .then(resJSON => console.log(resJSON))
    .catch(err => console.log(err));
});
