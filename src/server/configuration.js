module.exports = {
  db: {
    host: 'ep-hidden-water-aqg5nssl-pooler.c-8.us-east-1.aws.neon.tech',
    user: 'neondb_owner',
    database: 'jacc', // use neondb unless you created a DB named jacc
    password: 'npg_HJiqt7kcD3mB',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
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
