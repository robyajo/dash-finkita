module.exports = {
  apps: [
    {
      name: "dash-finkita",
      cwd: "/srv/node/dashboard.finkita.web.id/dash-finkita",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3109,
        // Kalau frontend butuh ENV khusus (misal API base URL), bisa ditaruh di sini
        // VITE_API_BASE_URL: "https://api.domain-anda.com"
      },
    },
  ],
}
