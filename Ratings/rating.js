var baseUrl = "http://127.0.0.1:8000/"

$("#submitrating").click(function () {
    var restaurantname = $('#Restaurantname').val();
    var rating = $('#Rating').val();

    // validate rating inputs exists(name and rating)
    if (restaurantname == "") {
      alert("Restaurant name is empty!")
      return
    }
    else if(rating == "") {
      alert("Rating is empty!")
      return
    }

    alert("Thank you for submitting your review !!");
    window.location.href = "../index.html";
  });
  