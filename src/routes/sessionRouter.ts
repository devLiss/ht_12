import {Router} from "express";
import {container} from "../composition-root";
import {SessionController} from "../controllers/session-controller";


export const sessionRouter = Router({})

const sessionController = container.resolve(SessionController)

sessionRouter.get('/', sessionController.getUserSessions)
sessionRouter.delete('/', sessionController.deleteAllSessions)
sessionRouter.delete('/:id', sessionController.deleteOtherSessions)