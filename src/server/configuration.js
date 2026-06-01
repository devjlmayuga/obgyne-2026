module.exports = {
  db: {
    // RDS Host
    // host: 'jacc-ob.cn3nw8jxs51l.ap-southeast-1.rds.amazonaws.com',
    // user: 'jacc',
    // database: 'jacc_db',

    // EC2 Host DEV
    // host: 'ec2-13-229-215-142.ap-southeast-1.compute.amazonaws.com',
    // user: 'jacc',
    // database: 'jacc_db',

    // EC2 Host PROD
    host: 'ec2-47-129-56-116.ap-southeast-1.compute.amazonaws.com',
    user: 'jacc',
    database: 'jacc_db',

    // Local Host
    // host: 'localhost',
    // user: 'johncarlvino',
    // database: 'johncarlvino',

    password: 'pass1234',
    port: 5432
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
