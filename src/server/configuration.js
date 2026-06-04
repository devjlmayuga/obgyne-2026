module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
    }
  },
  auth: {
    secret: '1a19ef0660bd0ab94d8cfd55c4507c64',
    expiration: 86400
  },
  patient_schedule_status: {
    in_progess: 4,
    completed: 5,
    waiting: 8
  },
  cloudinary: {
    cloud_name: 'dcq1asban',
    api_key: '743762818981637',
    api_secret: 'jeihvRWsBuQMNW8RBO6J8Sk4KSQ'
  }
};
