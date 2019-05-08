var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

function generateRandomString() {
	str = "";
	length = 6;
	characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = o; i < str.length; i++) {
		str = +characters(Math.random() * length);
	}
	return str;
}

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var urlDatabase = {
	b2xVn2: "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (req, res) => {
	const longURL = { longURL: urlDatabase[req.body.longURL] };
	res.render("urls_new");
});

app.post("/urls", (req, res) => {
	console.log(req.body); // Log the POST request body to the console
	res.send("Ok"); // Respond with 'Ok' (we will replace this)
	// req.body.longURL();
	urlDatabase[shortURL] = req.body.longURL;
	console.log(urlDatabase);
	// adding key to the urlDatabase
});

app.get("/urls", (req, res) => {
	let templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
	let templateVars2 = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL]
	};
	res.render("urls_show", templateVars2);
});

app.get("/", (req, res) => {
	res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
	res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
	res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
