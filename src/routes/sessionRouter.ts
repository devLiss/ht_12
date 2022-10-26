import {Router} from "express";
import {container} from "../composition-root";
import {SessionController} from "../controllers/session-controller";


export const sessionRouter = Router({})

const sessionController = container.resolve(SessionController)

sessionRouter.get('/', sessionController.getUserSessions.bind(sessionController))
sessionRouter.delete('/', sessionController.deleteAllSessions.bind(sessionController))
sessionRouter.delete('/:id', sessionController.deleteOtherSessions.bind(sessionController))