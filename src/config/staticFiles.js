import express from 'express';

const configStaticFiles = app => {
  // Cấu hình static file
  app.use(express.static('./src/public'));
};

export default configStaticFiles;
