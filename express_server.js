var express = require("express");
var cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

var app = express();
app.use(
  cookieSession({
    keys: ["mashpotatoes"]
  })
);

var PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("1234", 10)
  }
};

app.post("/login", function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.status(403).send("Email or Password cannot be blank");
    return;
  }
  let user = {};
  for (key in users) {
    if (email === users[key].email) {
      user = users[key];
    }
  }
  if (!bcrypt.compareSync(password, users[key].password)) {
    res
      .status(403)
      .send("Not a valid email or password, please try again or register");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

app.get("/login", function(req, res) {
  let input = {
    user: {},
    email: users[req.body.email],
    password: users[req.body.password]
  };
  res.render("urls_login", input);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: {},
    email: users[req.body.email],
    password: users[req.body.password]
  };
  res.render("urls_registration", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user_id = req.session["user_id"];
  let templateVars = {
    user: users[user_id] || {},
    longURL: urlDatabase[req.body.longURL]
  };
  if (user_id) {
    return res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

app.get("/u/:shortURL", (req, res) => {
  let user_id = req.session["user_id"];
  shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL].longURL;
  if (!longURL) {
    res.status(403).send("Not a valid short URL");
  } else {
    res.redirect(longURL);
  }
});

app.get("/urls", (req, res) => {
  let user_id = req.session["user_id"];
  let templateVars = {
    user: users[user_id] || {},
    urls: urlsForUser(user_id)
  };
  res.render("urls_index", templateVars);
});

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Not a valid Input");
    return;
  }
  for (id in users) {
    if (req.body.email == users[id].email) {
      res.status(400).send("This email already exists");
      return;
    } else {
      const password = req.body.password;
      const hashedPassword = bcrypt.hashSync(password, 10);
      let clientID = generateRandomString(4);
      users[clientID] = {
        id: clientID,
        email: req.body.email,
        password: hashedPassword
      };
      req.session["user_id"] = clientID;
    }
  }
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let user = req.session["user_id"];
  const shortURL = generateRandomString(6);
  let newURL = {
    longURL: req.body.longURL,
    userID: req.session["user_id"]
  };
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

app.post("/urls/:short/delete", (req, res) => {
  let user_id = req.session["user_id"];
  const short = req.params.short;
  delete urlDatabase[short];
  if (user_id) {
    return res.redirect("/urls");
  }
  res.redirect("login");
});

app.post("/urls/:someID", (req, res) => {
  if (!urlDatabase[req.params.someID]) {
    res.status(403).send("Not a valid short URL");
  } else {
    urlDatabase[req.params.someID].longURL = req.body.longURL;
    res.redirect("/urls");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.session["user_id"];
  if (!urlDatabase[req.params.shortURL]) {
    res.status(403).send("Not a valid short URL");
  } else {
    let templateVars = {
      user: users[user_id] || {},
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL
    };
    if (user_id) {
      return res.render("urls_show", templateVars);
    }
    res.redirect("/login");
  }
});

app.post("/logout", function(req, res) {
  req.session = null;
  res.redirect("/login");
});

function generateRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function urlsForUser(id) {
  obj = {};
  for (key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      obj[key] = urlDatabase[key];
    }
  }
  return obj;
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
