var baseUrl = "http://127.0.0.1:8000/"

// Function to validate username and password
$("#login").click(async function () {
    var username = $('#userName').val();
    var password = $('#password').val();
    var parm;

    // validate user inputs exists(username and password)
    if (username == "") {
        alert("Username is empty!")
        return
    }
    else if(password == "") {
        alert("Password is empty!")
        return
    }
    else {
        parm = {
            userName: username,
            password: password
        }
    }

    try {
        var result = await apiCall("get-login-result", parm); // Call Python API
        if (result == false) {
            alert("Login Failed!!");
        }
        else {
            alert("Login Successfull!!");
            window.location.href = "../AfterLogin.html";  // Temporarily re-direct to AfterLogin.html
        }
    } catch (err) {
        console.log(err);
    }
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