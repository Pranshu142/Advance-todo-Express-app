import Router from "express";
var router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("landingPage");
});


router.get("/about", function (req, res) {
  res.send(`<h1> about</h1>`);

});

router.get("/contact", function (req, res) {
  res.send(`<h1>contact </h1>`);

});

router.get("/t&c", function (req, res) {
  res.send(`<h1> hello world</h1>`);

});

router.get("/trademark", function (req, res) {
  res.send(`<h1> hello world</h1>`);

});

router.get("/about-company", function (req, res) {
  res.send(`<h1> hello world</h1>`);

});

export default router;
