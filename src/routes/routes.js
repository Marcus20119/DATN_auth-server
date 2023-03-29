import authRouter from './authRouter';
import getRouter from './getRouter';
import postRouter from './postRouter';
import updateRouter from './updateRouter';
import deleteRouter from './deleteRouter';

const initWebRoutes = app => {
  app.use('/auth', authRouter);
  app.use('/g', getRouter);
  app.use('/p', postRouter);
  app.use('/u', updateRouter);
  app.use('/d', deleteRouter);
};

export default initWebRoutes;
