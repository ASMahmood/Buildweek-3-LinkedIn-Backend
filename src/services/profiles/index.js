const express = require("express");
const ProfileModel = require("./schema");
const ExperienceSchema = require("../experiences/schema");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const profileRouter = express.Router();
const axios = require("axios");
const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { request } = require("express");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "benchmark3",
  },
});
const cloudinaryMulter = multer({ storage: storage });

profileRouter.post("/", async (req, res, next) => {
  try {
    const profileWithImage = {
      ...req.body,
      image:
        "https://res.cloudinary.com/dhmw620tl/image/upload/v1611568491/benchmark3/default-profile.png",
    };
    const newProfile = new ProfileModel(profileWithImage);
    const savedProfile = await newProfile.save();
    res.status(201).send(savedProfile);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.get("/", async (req, res, next) => {
  try {
    const allProfiles = await ProfileModel.find();
    res.send(allProfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.get("/:id", async (req, res, next) => {
  try {
    const singleProfile = await ProfileModel.findById(req.params.id).populate(
      "experiences"
    );
    if (singleProfile) {
      res.send(singleProfile);
    } else {
      res
        .status(404)
        .send(`We cannot find a user with the id: ${req.params.id}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.put("/:id", async (req, res, next) => {
  try {
    const alteredProfile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );
    if (alteredProfile) {
      res.send(alteredProfile);
    } else {
      res
        .status(404)
        .send(
          "The profile you would like to edit cannot be found inside our database. Bitch."
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedProfile = await ProfileModel.findByIdAndDelete(req.params.id);
    if (deletedProfile) {
      res.send("Profile successfully executed");
    } else {
      res.status(404).send("Profile escaped before we could execute it.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

profileRouter.post(
  "/:id/picture",
  cloudinaryMulter.single("profilePic"),
  async (req, res, next) => {
    try {
      const alteredProfile = await ProfileModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      );
      res.send(alteredProfile);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

profileRouter.get("/:id/profilePDF", async (req, res, next) => {
  try {
    // Getting user infos
    const id = req.params.id;
    const profile = await ProfileModel.findById(id);
    // Getting user experiences
    const experience = await ExperienceSchema.find({
      username: profile.username,
    });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${profile.name}.pdf`
    );

    async function example() {
      const doc = new PDFDocument();
      await axios
        .get(profile.image, { responseType: "arraybuffer" })
        .then((response) => {
          const imageBuffer = Buffer.from(response.data);
          doc.image(imageBuffer, 15, 15, { width: 250, height: 270 });
        });
      doc.text("PERSONAL INFOS", 350, 20);
      doc.text("EXPERIENCES", 230, 325);
      // Rows for the user infos
      row(doc, 40);
      row(doc, 60);
      row(doc, 80);
      row(doc, 100);
      row(doc, 120);
      // Rows for the user experiences
      row(doc, 210); // Role
      row(doc, 230); // Company
      row(doc, 250); // Start Date
      row(doc, 270); // End Date
      row(doc, 290); // Description
      row(doc, 310); // Area
      // Content of user infos
      textInRowFirst(doc, "Name:", 40);
      textInRowFirst(doc, "Surname:", 60);
      textInRowFirst(doc, "Email:", 80);
      textInRowFirst(doc, "Area:", 100);
      textInRowFirst(doc, "Username:", 120);

      textInRowSecond(doc, profile.name, 40);
      textInRowSecond(doc, profile.surname, 60);
      textInRowSecond(doc, profile.email, 80);
      textInRowSecond(doc, profile.area, 100);
      textInRowSecond(doc, profile.username, 120);

      const exLineHeight = 345;
      const addSpace = 160;
      const jForLenght = experience.length;

      for (let j = 0; j < jForLenght; j++) {
        let LineHeight = exLineHeight;
        for (let i = 0; i < 2; i++) {
          textInRowFirstExperiences(doc, "Role:", LineHeight); //345
          textInRowFirstExperiences(doc, "Company", LineHeight + 20); //365
          textInRowFirstExperiences(doc, "Start Date", LineHeight + 40); // 385
          textInRowFirstExperiences(doc, "End Date", LineHeight + 60); // 405
          textInRowFirstExperiences(doc, "Description", LineHeight + 80); // 425
          textInRowFirstExperiences(doc, "Area", LineHeight + 100); // 445

          textInRowSecondExperiences(doc, experience[i].role, LineHeight); //345
          textInRowSecondExperiences(
            doc,
            experience[i].company,
            LineHeight + 20
          ); //365
          textInRowSecondExperiences(
            doc,
            experience[i].startDate,
            LineHeight + 40
          ); // 385
          textInRowSecondExperiences(
            doc,
            experience[i].endDate,
            LineHeight + 60
          ); // 405
          textInRowSecondExperiences(
            doc,
            experience[i].description,
            LineHeight + 80
          ); // 425
          textInRowSecondExperiences(doc, experience[i].area, LineHeight + 100); // 445

          LineHeight = exLineHeight + addSpace * (i + 1);
        }
      }
      doc.pipe(res);
      doc.end();
      doc.on("finish", function () {
        // do stuff with the PDF file
        return res.status(200).json({
          ok: "ok",
        });
      });
    }

    // Function for user infos
    function textInRowFirst(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 275;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function textInRowSecond(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 375;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    // Function for user experiences
    function textInRowFirstExperiences(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 15;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function textInRowSecondExperiences(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 120;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function row(doc, heigth) {
      doc.lineJoin("miter").rect(30, heigth, 500, 20);
      return doc;
    }

    example();
  } catch (error) {
    console.log(error);
    next("While reading profiles list a problem occurred!");
  }
});

module.exports = profileRouter;
