const express = require('express');

const router = express.Router();
const userService = require('../services/admin.user.service.js');
const { exec } = require("child_process");
const path = require("path");

async function login(req, res) {
  await userService.isUserExisting(req, res);
}

router.post('/login', login);


router.get("/renew-cert", async (req, res) => {
  try {
    const scriptPath = path.join(__dirname, "cert-renew.sh");

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
      }

      console.log(`stdout: ${stdout}`);
      if (stderr) console.error(`stderr: ${stderr}`);

      res.json({
        success: true,
        output: stdout || stderr || "Script executed.",
      });
    });
  } catch (err) {
    console.error("Exception:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
