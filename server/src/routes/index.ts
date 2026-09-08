import { Router } from 'express';
import healthRoutes from './health.routes';
import alertRoutes from './alert.routes';
import disasterRoutes from './disaster.routes';
import shelterRoutes from './shelter.routes';
import sosRoutes from './sos.routes';
import safeBeaconRoutes from './safeBeacon.routes';
import communityReportRoutes from './communityReport.routes';
import chatRoutes from './chat.routes';
import historyRoutes from './history.routes';
import notificationRoutes from './notification.routes';
import profileRoutes from './profile.routes';
import downloadRoutes from './download.routes';

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use(alertRoutes);
apiRouter.use(disasterRoutes);
apiRouter.use(shelterRoutes);
apiRouter.use(sosRoutes);
apiRouter.use(safeBeaconRoutes);
apiRouter.use(communityReportRoutes);
apiRouter.use(chatRoutes);
apiRouter.use(historyRoutes);
apiRouter.use(notificationRoutes);
apiRouter.use(profileRoutes);
apiRouter.use(downloadRoutes);

export default apiRouter;
