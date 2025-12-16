import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    // console.log("the url is :"+req.path);    
    let uploadPath = "";
    // if (req.path.includes("profile")) {
    //   uploadPath = "../../public/profile";
    // } else if (req.path.includes("data")) {
    //   uploadPath = "../../public/others";
    // }

    if (req.path.includes("auth/register")) {
    uploadPath = path.join(process.cwd(), "public/profile");
  } else {
    uploadPath = path.join(process.cwd(), "public/others");
  }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100mb
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only image files are allowed."), false);
  },
});
