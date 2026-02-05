const upload = require("../config/multer");

exports.uploadFiles = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 }
]);

