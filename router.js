var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");

//Handle HTTP GET for /
function home (request, response) {

	if(request.url === "/") {
		if(request.method.toLowerCase() === "get") {
			response.writeHead(200, {'Content-Type': 'text/html'});
			renderer.view("header", {}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();

	} else {
		// if url = "/" & POST, then get post data from body
		request.on("data", function(postBody) {
			//extract the username
			var query = querystring.parse(postBody.toString());
			//redirect to /username
			response.writeHead(303, {"Location":"/"+query.username});
			response.end();
		});


	}
}
}
//Handle HTTP GET for /username
function user(request, response) {
	//extract username from the url header in the request, need to remove the /
	var username = request.url.replace("/","");
	//if there is a username
	if(username.length>0 ){
		response.writeHead(200, {'Content-Type': 'text/html'});
		renderer.view("header", {}, response);

		//user Profile to get the username json from Treehouse
		var studentProfile = new Profile(username);
		//when data is received fully AKA "end" event
		studentProfile.on("end", function (profileJSON) {

			//store the values which we need
			var values = {
				avatarUrl: profileJSON.gravatar_url,
				username: profileJSON.profile_name,
				//badges is an array in the JSON, so need to get length
				badges: profileJSON.badges.length,
				javascriptPoints: profileJSON.points.JavaScript
			}

			renderer.view("profile", values, response);
			renderer.view("footer", {}, response);
			response.end();
		});

		//when data is received with error
		studentProfile.on("error", function (error) {
			//the error object will have a message property
			renderer.view("error", {errorMessage: error.message}, response);
			renderer.view("search", {}, response);
			renderer.view("footer", {}, response);
			response.end();
		});


	}



}

module.exports.home = home;
module.exports.user = user;