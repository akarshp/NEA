var baseUrl = "http://127.0.0.1:8000/"

$(document).ready(async function () {
  var topRestro = $("#topRestro");
  topRestro.empty();
  topRestro.append("<tr> <th>Restaurant</th> <th>Name and Location</th> </tr>");  // Leaderboard table header

  // Fetch and display 4 Top rated restaurants in the Leaderboard
  try {
    var result = await apiCall("get-toprestro-result", null); //API call to DB 

    if (result.length == 0)  // If no restaurants found
    {
      topRestro.append("<h1>No Top Restaurant found!</h1>")
    }
    else  
    {
      for (var i = 0; i < result.length; i++) {
        var rating = "";
        for (var j = 0; j < 5; j++) // convert rating number to * for display
        {
          // append * in the ratings variable
          rating += result[i][5] > j ? "<span class='fa fa-star checked'> </span>" : "<span class='fa fa-star'></span> "
        }
        // display restaurant as table row
        topRestro.append("<tr>" +
          "<td><img src=" + result[i][6] + " width='300' height='200' /></td>" + // use the image fetched from the database
          "<td> <h2>" + result[i][0] + "</h2>" + rating + "<br />" + "<a href='" + result[i][4] + "' class='btn btn-primary' target='_blank'>Location</a> </td>" +
          "</tr>");
      }
    }
  } catch (err) 
  {
    console.log(err);

  }
});


// On Search click fetch the restaurants based on Location or Cuisine
$("#search").click(async function () {
  //alert("Search clicked");
  var search = $('input[name=toggle]:checked').val();
  var searchText = $('#searchText').val();
  var parm;
  var cardDiv = $("#cards");
  cardDiv.empty();

  //alert("LINE ..In Javascript code ...");
  //alert(search);
  //alert(searchText);

  if (searchText == "") {
    //alert("Empty Search");
    cardDiv.append("<h1>Search is empty!</h1>")
    return
  }
  else {
    parm = {
      search: search,
      searchText: searchText
    }
  }

  // hide the Leaderboard sections
  $("#topRestro").css({ visibility: 'hidden' })
  $("#topRestroHeader").css({ visibility: 'hidden' })

  // API call to fetch the list of restaurants (either by Location or Cuisine)
  try 
  {
    var result = await apiCall("get-search-result", parm);  // API call to DB
    cardDiv.empty(); 
    if (result.length == 0) {
      cardDiv.append("<h1>No data found related to the search!</h1>") // It creates a card to display the message//
    }
    else {
      await displayCard(cardDiv, result); // Calling the procedure displayCard which is below
      await initializeFilter(search, searchText, parm)
    }
  } catch (err) { 
    console.log(err); // This will display the errors 

  }
});

$("#login").click(function () {
  window.location.href = "Login/login.html";
});

$("#signout").click(function () {
  window.location.href = "index.html";
});

$("#submitrating").click(function () {
  window.location.href = "index.html";
});

var apiCall = function (url, parm) {
  return $.ajax(
    {
      url: baseUrl + url,
      dataType: "json",
      traditional: true,
      data: parm
    }
  );
}

// Display unique Regions or Cuisines(on the left hand side column) to enable further filtering the restaurant list by Region or Cuisine
var initializeFilter = async function (search, searchText, parm) 
{
  var filter = $("#filter");
  $("#filterbar").css({ visibility: 'visible' })

  try {
    var result = await apiCall("get-filter", parm); // API call to DB
    filter.empty();
    if (result.length <= 1) {
      return;
    }
    else {
      await displayFilter(filter, result);
    }

  } catch (err) {
    console.log(err);
  }
};

// Display choosen restaurants (based on Region or Location)
var displayCard = async function (cardDiv, result) 
{
  for (var i = 0; i < result.length; i++) {
    var rating = "";
    for (var j = 0; j < 5; j++) // convert rating number to * for display
    {
      rating += result[i][5] > j ? "<span class='fa fa-star checked'> </span>" : "<span class='fa fa-star'></span> "
    }
    cardDiv.append("<div class='col-3 m-3' style=''>" +
      "<div class='card'>" +
      "<img class='card-img-top' src="+ result[i][6] + "?w=2000' alt='Card image cap'>" + // fetch the image from the database
      "<div class='card-body'>" +
      "<h1 class='card-title'>" + result[i][0] + "</h1>" +
      "<p class='card-text'>Address : " + result[i][1] + "</p>" +
      rating +
      " <a href='" + result[i][4] + "' class='btn btn-primary' target='_blank'>Location</a>" +  //location
      "</div>" +
      "</div>" +
      "</div>");
  }
};

// Display filter results 
var displayFilter = async function (filterDiv, result) 
{
  for (var i = 0; i < result.length; i++) {
    filterDiv.append("<div class='form-check form-check-inline'>" +
      "<input class='form-check-input' type='radio' name='inlineRadioOptions' id='inlineRadio1' value='" + result[i] + "'>" +
      "<label class='form-check-label' for='inlineRadio1'>" + result[i] + "</label>" +
      "</div>")
  }
};

// Display further refined results based on the additional filters(Region / Cuisines)
$('#filter').on('change', 'input[name=inlineRadioOptions]:checked', async function () 
{
  var value = $(this).val();
  var search = $('input[name=toggle]:checked').val();
  var searchText = $('#searchText').val();
  var parm;
  var cardDiv = $("#cards");

  parm = {
    search: search,
    searchText: searchText,
    filterList: value
  }
  try {
    var result = await apiCall("get-filter-result", parm); // API call for further filtering the restaurants
    cardDiv.empty();
    if (result.length == 0) {
      cardDiv.append("<h1>No data found relate to the search!</h1>")
    }
    else {
      await displayCard(cardDiv, result);
    }
  } catch (err) {
    console.log(err);
  }
});

$("#reset").click(async function () {
  var cardDiv = $("#cards");
  cardDiv.empty();

  $('#searchText').val('');

  var filter = $("#filter");
  filter.empty();
  $("#filter").css({ visibility: 'hidden' })
  $("#filterbar").css({ visibility: 'hidden' })

  $("#topRestro").css({ visibility: 'visible' })
  $("#topRestroHeader").css({ visibility: 'visible' })
});

