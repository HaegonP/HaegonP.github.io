const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "https://pokebonk.com";

app.get("/health", (req, res) => res.send("Server is running!"));

// Your launcher page now lives here
app.get("/launcher", (req, res) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

// Everything else is forwarded to the target site
app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,   // sets Host header to the target's
    ws: true,             // proxy websockets (games often need these)
    autoRewrite: true,    // rewrites redirect Location headers to your host
    cookieDomainRewrite: "",
  })
);

app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));
