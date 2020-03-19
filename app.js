require("dotenv").config();
var express = require("express"),
    app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("app");
});


app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server started at localhost:"+process.env.PORT);
});
