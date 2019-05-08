var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var urlDatabase = {
	b2xVn2: "http://www.lighthouselabs.ca",
	"9sm5xK": "http://www.google.com"
};

app.get("/u/:shortURL", (req, res) => {
	const longURL = res.redirect(longURL);
});

app.get("/u/new", (req, res) => {
	const longURL = { longURL: urlDatabase[req.body.longURL] };
	res.render("urls_new");
});

app.post("/u", (req, res) => {
	const shortURL = generateRandomString(6);
	console.log(req.body); // Log the POST request body to the console
	res.redirect(shortURL); // Respond with 'Ok' (we will replace this)
	urlDatabase[shortURL] = req.body.longURL;
	console.log(urlDatabase);
});

app.get("/u", (req, res) => {
	let templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
	let templateVars2 = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL]
	};
	res.render("urls_show", templateVars2);
});

app.get("/", (req, res) => {
	res.send("Hello!");
});

app.get("/u.json", (req, res) => {
	res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
	res.send("<html><body>Hello <b>World</b></body></html>\n");
});

function generateRandomString(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
