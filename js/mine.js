let obtainedMovies = [];
let temporarySearchResults = []

async function fetchMovies(url, temporary=false)
{
    var apiResponse = await fetch(url);
    var mainResponse = await apiResponse.json();
    if(!temporary)
    {
        obtainedMovies = Array.from( mainResponse.results);
        showMovies(obtainedMovies);
    }
    else
    {
        temporarySearchResults = Array.from( mainResponse.results);
        showMovies(temporarySearchResults)
    }
    
    // $("#poster").mouseenter(
    //     //function() {$("#movieInfo").animate({top:"0px"}, 1000)}, 
    //     function()
    //     {
    //         let posterHeight = $(this).height();
    //         console.log(posterHeight);
    //         $("#movieInfo").animate({top : "0px"}, 1000 );
    //         //$("#movieInfo").animate({top : `${posterHeight} px`}, 1000 );
    //     }
    //   );
}

function showMovies(movies)
{
    let postersCode = "";
    let imagePath = "https://image.tmdb.org/t/p/w500/";

    for(var i=0; i < movies.length; i++)
    {
        let currentImagePath = imagePath + movies[i].poster_path;
        postersCode += `
        <div id="poster" class="col-md-6 col-lg-4 my-3 overflow-hidden shadow">
            <div class="position-relative w-100">
                <img id="posterImg" src="${currentImagePath}" class="img-fluid w-100 poster rounded">
                <div class="poster-overlay w-100 h-100 d-flex align-items-center position-absolute">
                    <div id="movieInfo" class="w-100 text-center p-2 rounded">
                        <h2>${obtainedMovies[i].original_title}</h2>
                        <p>${obtainedMovies[i].overview}</p>
                        <p>rate: ${obtainedMovies[i].vote_average}</p>
                        <p>${obtainedMovies[i].release_date}</p>
                    </div>    
                </div>
            </div>
        </div>
        `;
    }

    
    $("#moviesPosters").html(postersCode);
}

function validateEmail(email)
{
        return String(email).toLowerCase().match(
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          );
}

function validateName(name)
{
    return String(name).toLowerCase().match(
        /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      );
}

function validatePhone(phone)
{
    return String(phone).toLowerCase().match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,5}$/
      );
}

function validateAge(age)
{
    return String(age).toLowerCase().match(
        /^([1-9]{1}$)|^([1-9]{1}[0-9]{1}$)/
        );
}

function validatePassword(password)
{
    return String(password).toLowerCase().match(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        );
}

$("#regularSearch").keyup(function(){
    let targetMovie = $(this).val();
    if(targetMovie == "")
    {
        console.log(obtainedMovies);
        showMovies(obtainedMovies);
    }

    else
    {
        let targetMovies = [];
        $("#searchByApi").val("");

        for(var i=0; i< obtainedMovies.length; i++)
        {
            if(String(obtainedMovies[i].original_title).toLowerCase().includes(String(targetMovie).toLocaleLowerCase()))
            {
                targetMovies.push(obtainedMovies[i]);
            }
        }
        showMovies(targetMovies, true);
    }
});

$("#searchByApi").keyup(function(){
    let targetMovie = $(this).val();
    if(targetMovie == "")
    {
        console.log(obtainedMovies);
        showMovies(obtainedMovies);
    }
    else
    {
        $("#regularSearch").val("");
        fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=b259e4edac929f6e7b2d69700178ed94&language=en-US&page=1&include_adult=false&query=${targetMovie}`, true);
    }
});

$("#barController").click(function(){
    
    let navListWidth = $(".navList").width();

    let leftValue = $(".navList").css("left");
    
    // nav bar is shown then collapse it
    if(leftValue == "0px")
    {
        $(".navList").animate({left:"-100%"}, 500);
        $(".navBarHead").animate({left:"0px"}, 500);
        $("#barController").html(`<i id="barController" class="fa fa-align-justify text-center"></i>`);

        // should have made the options fly downwards but didn't work, dunno why!
        $(".navList .barOption").each(function(){
            $(this).animate({top: `30%px`}, 1000);
         });
    }
    // nav bar is collapsed then open it
    else
    {
        $(".navList").animate({left:"0"}, 500);
        $(".navBarHead").animate({left: `+=${navListWidth}px`}, 500);
        $("#barController").html(`<i id="barController" class="fa fa-align-justify fa-times text-center"></i>`);

        let optionIndex = 0;
        let startingY = 15;
        let optionheight = $(".barOption").outerHeight(true);

        // make the options fly up
        $(".navList .barOption").each(function(){
            $(this).animate({top: `${startingY + optionIndex * optionheight}px`}, 1000);
            optionIndex++;
         });
    }
    
})

$("#nowPlayingBtn").click(function(){
    fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=b259e4edac929f6e7b2d69700178ed94&language=en-US&page=1`);
})

$("#popularBtn").click(function(){
    fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=b259e4edac929f6e7b2d69700178ed94&language=en-US&page=1`);
})

$("#topRatedBtn").click(function(){
    fetchMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=b259e4edac929f6e7b2d69700178ed94&language=en-US&page=1`)
})

$("#trendingBtn").click(function(){
    fetchMovies(`https://api.themoviedb.org/3/trending/all/day?api_key=b259e4edac929f6e7b2d69700178ed94`)
})

$("#upcomingBtn").click(function(){
    fetchMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=b259e4edac929f6e7b2d69700178ed94&language=en-US&page=1`)
})

$("#nameInput").keyup(function(){
    let name = $(this).val();
    if(name.length == 0 || !validateName(name))
    {
        $("#nameWarning").removeClass("d-none");
    }

    else
    {
        $("#nameWarning").addClass("d-none");
    }
});

$("#emailInput").keyup(function(){
    let email = $(this).val();
    if(!validateEmail(email))
    {
        $("#emailWarning").removeClass("d-none");
    }
    else
    {
        $("#emailWarning").addClass("d-none");
    }
});

$("#phoneInput").keyup(function(){
    let phone = $(this).val();
    if(!validatePhone(phone))
    {
        $("#phoneWarning").removeClass("d-none");
    }
    else
    {
        $("#phoneWarning").addClass("d-none");
    }
});

$("#ageInput").keyup(function(){
    let age = $(this).val();
    if(!validateAge(age))
    {
        $("#ageWarning").removeClass("d-none");
    }
    else
    {
        $("#ageWarning").addClass("d-none");
    }
});

$("#passwordInput").keyup(function(){
    let password = $(this).val();

    if(!validatePassword(password))
    {
        $("#passwordWarning").removeClass("d-none");
    }
    else
    {
        $("#passwordWarning").addClass("d-none");
    }
});

$("#passwordReInput").keyup(function(){
    
    let repassword = $(this).val();

    if($("#passwordInput").val() != repassword)
    {
        $("#rePasswordWarning").removeClass("d-none");
    }
    else
    {
        $("#rePasswordWarning").addClass("d-none");
    }

    
});


fetchMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=b259e4edac929f6e7b2d69700178ed94&language=en-US&page=1`);