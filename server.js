const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "https://pokebonk.com";

app.get("/health", (req, res) => res.send("Server is running!"));

app.get("/launcher", (req, res) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    ws: true,
    cookieDomainRewrite: "",
    on: {
      proxyRes: (proxyRes, req) => {
        console.log(
          req.method, req.url, "->", proxyRes.statusCode,
          proxyRes.headers.location || "",
          proxyRes.headers["server"] || ""
        );
      },
      error: (err, req, res) => {
        console.log("PROXY ERROR:", req.url, err.message);
        if (res.writeHead) {
          res.writeHead(502);
          res.end("Proxy error: " + err.message);
        }
      },
    },
  })
);

app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));
