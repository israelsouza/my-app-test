import express from "express";
import cors from "cors";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend's URL
  methods: ["GET", "POST"],
}));

app.get("/imaginaria", (req, res) => {
  return res.json({
    message: "Hello World",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});