const searchInput = document.getElementById("search-input")
const seachbtn = document.getElementById("search-btn");
const leftContainer = document.querySelector(".left");
const rightContainer = document.getElementById("right-container");


seachbtn.addEventListener("click",(event)=>{
   event.preventDefault();


   const query = searchInput.value


ShowLoadingSpinner();

    fetch(`https://api.edamam.com/search?q=${query}&app_id=616a9d80&app_key=313fcf560ba39e7a4d8eb81cddc794bb`)
  .then((res) => res.json())  // Ensure you return the parsed JSON
  .then((data) => {
    // console.log(data);  // Now you can use the parsed response

    hideLoadingSpinner()
    displayResults(data.hits);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);  // Handle errors
  });
    
})

function ShowLoadingSpinner(){
    leftContainer.innerHTML=`
    
    <div class="d-flex justify-content-center align-items-center" style="height: 100px;" >\

     <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
    </div>
    `;
}


function hideLoadingSpinner(){
    leftContainer.innerHTML=""
}

function displayResults(result){
    leftContainer.innerHTML = "";
    if(!result || result.length  === 0){
        leftContainer.innerHTML = "<p >No Recipes Found</p>";
        return;
    }

    result.forEach((result) => {
        const recipe = result.recipe;
        const recipeItem = document.createElement("div");
        recipeItem.classList.add("recipe-item", "mb-3", "px-5");
        recipeItem.innerHTML = `
            <div class="recipe-content d-flex align-items-center">
                <img src="${recipe.image}" alt="${recipe.label}" class="recipe-img w-25">
                <div class="recipe-info ms-3">
                    <h4>${recipe.label}</h4>
                    <p>Calories: ${Math.round(recipe.calories)}</p>
             <button class="view-recipe-btn btn btn-primary mt-2" data-recipe='${JSON.stringify(recipe)}'>View Recipe</button>

                </div>
            </div>
        `;
        leftContainer.appendChild(recipeItem);
    });


 // Attach event listeners to "View Recipe" buttons
 document.querySelectorAll(".view-recipe-btn").forEach(button => {
    button.addEventListener("click", (event) => {
        const recipeData = JSON.parse(event.target.getAttribute("data-recipe"));
        displayRecipeInRightContainer(recipeData);
    });
});
}




function displayRecipeInRightContainer(recipe) {
    rightContainer.innerHTML = `
        <div class="recipe-details p-3">
            <h2>${recipe.label}</h2>
            <img src="${recipe.image}" alt="${recipe.label}">
            <p class="text-center">Calories: ${Math.round(recipe.calories)}</p>
            <h4>Ingredients:</h4>
            <ul class="text-center" style="list-style-type: none; padding-left: 0;">
                ${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <h4>Instructions:</h4>
            <p class="text-center"><a href="${recipe.url}" target="_blank">Click here for full recipe</a></p>
 <div>
                <button class="btn btn-danger" onclick='addToBookmark(${JSON.stringify(recipe)})'> Add To Bookmark </button>
            </div>


        </div>

    `;
}






let bookmarks = [];
 function addToBookmark(recipe){
    if(!bookmarks.some(bookmarkedRecipe =>bookmarkedRecipe.label === recipe.label)){
        bookmarks.push(recipe);
        updateBookmarkedList();  
        console.log("recipe added to bookmark",recipe.label)
    }else{
        alert("recipe already Bookmarked")
    }
 }


 function updateBookmarkedList(){
    const bookmarklist = document.getElementById("bookmark-list")
    bookmarklist.innerHTML="";


    bookmarks.forEach(bookmark =>{


        const listItem = document.createElement("li");
        listItem.classList.add('bookmark-item','p-2','border-bottom');
        listItem.innerHTML=`
        <div class="d-flex justify-content-between align-items-center">
                <span>${bookmark.label}</span>
                <img src="${bookmark.image}" alt="${bookmark.label}" style="width: 50px; height: 50px; object-fit: cover;">
            </div>
        `


     

        listItem.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Clicked on:', bookmark);  // Debug to see if the correct recipe is clicked
            displayRecipeInRightContainer(bookmark);  // Display the clicked recipe in the right container
        });

        bookmarklist.appendChild(listItem);
    })
    console.log('Updated bookmark list:', bookmarks); 
 }




