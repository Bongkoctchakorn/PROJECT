const express = require("express");
const axios = require("axios");
const app = express();
var bodyParser = require("body-parser");
const path = require("path");



// Base URL for the API
//const base_url = "https://api.example.com";
const base_url = "http://localhost:3000";
//const base_url = "http://node41091-noderest.proen.app.ruk-com.cloud";

// Set the template engine
app.set("views", path.join(__dirname,"/public/views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files

app.use(express.static(__dirname + "/public"));
//---------------------------------------------------------------------------------------------------------------------
//Studio Animation-----------------------------------------------------------------------------------------------------

app.get("/sanis3", async (req, res) => {
  try {
    const response = await axios.get(base_url + '/sanis3');
    res.render("sanis3", { sanis: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});




app.get("/sanis", async (req, res) => {
  try {
      const response = await axios.get(base_url + '/sanis');
      res.render("sanis", { sanis: response.data });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

app.get("/sani/:id" , async (req, res) => {
  try {
      const response = await axios.get(base_url + '/sanis/' + req.params.id);
      res.render("sani", { sani: response.data });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});


// สร้างหน้า create3.ejs เพื่อแสดงฟอร์มสำหรับสร้างข้อมูลใหม่
app.get("/create3", async (req, res) => {
  try {
    const studiosResponse = await axios.get(base_url + '/studios');
    const animationsResponse = await axios.get(base_url + '/animations');
    
    res.render("create3", { studios: studiosResponse.data, animations: animationsResponse.data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// ประมวลผลการสร้างข้อมูลใหม่จากฟอร์ม
app.post("/create3", async (req, res) => {
  try {
    const data = {
      id_sa: req.body.id_sa,
      studioId: req.body.studioId,
      animeId: req.body.animeId,
    };
    
    // Send a POST request to your API to create a new Studio Animation
    await axios.post(base_url + '/sanis', data);
    
    // Redirect to the list of Studio Animations after creating one
    res.redirect("/sanis");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});


// แสดงหน้าแก้ไขข้อมูล
app.get("/update3/:id_sa", async (req, res) => {
  try {
    const response = await axios.get(
      base_url + '/sanis/' + req.params.id_sa
    );

    // เรียกข้อมูลสตูดิโอจากตาราง studios
    const studiosResponse = await axios.get(base_url + '/studios');
    
    // เรียกข้อมูลอนิเมชันจากตาราง animations
    const animationsResponse = await axios.get(base_url + '/animations');
    
    res.render("update3", { sani: response.data, studios: studiosResponse.data, animations: animationsResponse.data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});



// ประมวลผลการแก้ไขข้อมูล
app.post("/update3/:id_sa", async (req, res) => {
  try {
    const data = {
      id_sa: req.body.id_sa,
      studioId: req.body.studioId,
      animeId: req.body.animeId
    };

    // ใช้ axios ส่งข้อมูลการแก้ไขไปยัง API ของคุณ
    await axios.put(base_url + '/sanis/' + req.params.id_sa, data);

    // หลังจากแก้ไขข้อมูลเสร็จแล้ว ให้ redirect กลับไปหน้าแสดงข้อมูลทั้งหมด
    res.redirect("/sanis");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});
// ประมวลผลการลบข้อมูล
app.get("/delete3/:id_sa", async (req, res) => {
  try {
    // ใช้ axios ส่งคำขอลบข้อมูลไปยัง API ของคุณ
    await axios.delete(base_url + '/sanis/' + req.params.id_sa);

    // หลังจากลบข้อมูลเสร็จแล้ว ให้ redirect กลับไปหน้าแสดงข้อมูลทั้งหมด
    res.redirect("/sanis");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

//-----------------------------------------------------------------------------------------------------------
//Studio-----------------------------------------------------------------------------------------------------
app.get("/studios", async (req, res) => {
  try {
      const response = await axios.get(base_url + '/studios');
      res.render("studios", { studios: response.data });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

app.get("/studio/:id" , async (req, res) => {
  try {
      const response = await axios.get(base_url + '/studios/' + req.params.id);
      res.render("studio", { studio: response.data });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

//create studio
app.post("/create", async (req, res) => {
  try {
      const data = { id_studio: req.body.id_studio, studio: req.body.studio };
      await axios.post(base_url + '/studios', data);
      res.redirect("/studios");
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

//update studio
app.get("/update/:id_studio", async (req, res) => {
  try {
      const response = await axios.get(
          base_url + '/studios/' + req.params.id_studio);
          res.render("update", {studio: response.data});
      } catch (err) {
          console.error(err);
          res.status(500).send('Error');
      }
});

//update studio
app.post("/update/:id_studio", async (req, res) => {
  try {
      const data = { id_studio: req.body.id_studio,studio: req.body.studio };
      await axios.put(base_url + '/studios/' + req.params.id_studio, data);
      res.redirect("/studios");
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

//delete studio
app.get("/delete/:id_studio", async (req, res) => {
  try {
      await axios.delete(base_url + '/studios/' + req.params.id_studio);
      res.redirect("/studios");
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});
//------------------------------------------------------------------------------------------------------
//Animation---------------------------------------------------------------------------------------------
app.get("/animations", async (req, res) => {
  try {
      const response = await axios.get(base_url + '/animations');
      res.render("animations", { animations: response.data });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

app.get("/animation/:id" , async (req, res) => {
  try {
      const response = await axios.get(base_url + '/animations/' + req.params.id);
      res.render("animation", { animation: response.data });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

app.get("/create2", (req, res) => {
  res.render("create2");
});

//create animation
app.post("/create2", async (req, res) => {
  try {
      const data = { id_anime: req.body.id_anime, anime: req.body.anime };
      await axios.post(base_url + '/animations', data);
      res.redirect("/animations");
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

//update animation
app.get("/update2/:id_anime", async (req, res) => {
  try {
      const response = await axios.get(
          base_url + '/animations/' + req.params.id_anime);
          res.render("update2", {animation: response.data});
      } catch (err) {
          console.error(err);
          res.status(500).send('Error');
      }
});

//update animation
app.post("/update2/:id_anime", async (req, res) => {
  try {
      const data = { id_anime: req.body.id_anime, anime: req.body.anime};
      await axios.put(base_url + '/animations/' + req.params.id_anime, data);
      res.redirect("/animations");
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});

//delete animation
app.get("/delete2/:id_anime", async (req, res) => {
  try {
      await axios.delete(base_url + '/animations/' + req.params.id_anime);
      res.redirect("/animations");
  } catch (err) {
      console.error(err);
      res.status(500).send('Error');
  }
});
//------------------------------------------------------------------------------------------------------

//app.listen(8080, () => {
//    console.log('Server started on port 8080');
//});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});