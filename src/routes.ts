import { Router } from "express";
import { validate } from "./Middleware/validate.js";
import { body, param } from "express-validator";
import { Request, Response } from "express";
import { UserController } from "./Controller/UserController.js";
import { QuickChallengeController } from "./Controller/QuickChallengeController.js";
import { authToken } from "./Middleware/auth.js";
import { QuickChallengeService } from "./Service/QuickChallengeService.js";

const router = Router();
const userController = new UserController();
const quickChallengeController = new QuickChallengeController();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

//USER ROUTES
router.post(
  "/user/register",
  validate([
    body("email").isEmail(),
    body("password").isString().notEmpty(),
    body("name").isString().notEmpty(),
  ]),
  async (req, res) => {
    userController.handleRegister(req, res);
  }
);

router.post(
  "/user/login",
  validate([
    body("email").isEmail(), 
    body("password").isString().notEmpty()
  ]),
  async (req, res) => {
    userController.handleLogin(req, res);
  }
);

router.post(
  "/user/verificationCode",
  validate([
    body("email").isEmail()
  ]),
  async (req, res) => {
    userController.handleVerificationCode(req, res);
  }
);

router.patch(
  "/user/password/",
  validate([
    body("newPassword").isString().notEmpty(),
    body("verificationCode").isString().notEmpty(),
    body("email").isEmail()
  ]),
  async (req, res) => {
    userController.handlePasswordPatch(req, res);
  }
);

router.post(
  "/user/token",
  validate([body("email").isEmail(), body("password").isString().notEmpty()]),
  async(req,res) => {
    userController.getUserToken(req, res);
  }
);

router.delete(
  "/user",
  [authToken()],
  async (req: Request, res: Response) => {
    userController.handleAccountDeletion(req, res)
  }
);



//QUICK CHALLENGE ROUTES
router.post(
  "/quickChallenge/create",
  [
    authToken(),
    validate([
      body("name").isString().notEmpty(),
      body("type").isString().notEmpty(),
      body("goal").isNumeric().notEmpty(),
      body("goalMeasure").isString().notEmpty(),
      body("userId").isUUID().notEmpty(),
      body("online").isBoolean().notEmpty(),
      body("maxTeams").isNumeric().notEmpty(),
    ]),
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.createChallenge(req, res);
  }
);

router.post(
  "/quickChallenge/join",
  [
    authToken(), 
    validate([
      body("invitationCode").isString().notEmpty()
    ])
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.joinByInvitationCode(req, res);
  }
);

router.get(
  "/quickChallenge/createdByMe",
  [authToken(), validate([body("userId").isUUID().notEmpty()])],
  async (req: Request, res: Response) => {
    quickChallengeController.getUserQuickChallengesById(req, res);
  }
);

router.get(
  "/quickChallenge/playing",
  [authToken()],
  async (req: Request, res: Response) => {
    quickChallengeController.getUserPlayingQuickChallengesById(req, res);
  }
);

router.delete(
  "/quickChallenge/:id",
  [authToken(), validate([body("userId").isUUID().notEmpty()])],
  async (req: Request, res: Response) => {
    quickChallengeController.deleteQuickChallenge(req, res);
  }
);

//need the 3 ids for the offline mode, where the member wont have userId, then we need to check if the authToken has the UserId from the Challenge.ownerId.
router.patch(
  "/quickChallenge/:quickChallengeId/team/:teamId/member/:teamMemberId/score",
  [
    authToken(),
    validate([
      body("score").isNumeric().notEmpty(),
      param("quickChallengeId").isUUID().notEmpty(),
      param("teamId").isUUID().notEmpty(),
      param("teamMemberId").isUUID().notEmpty(),
    ]),
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.patchScore(req, res);
  }
);

router.patch(
  "/quickChallenge/:quickChallengeId/alreadyBegin",
  [
    authToken(),
    validate([
      body("alreadyBegin").isBoolean().notEmpty(),
      param("quickChallengeId").isUUID().notEmpty(),
    ]),
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.patchAlreadyBegin(req, res);
  }
);

router.patch(
  "/quickChallenge/:quickChallengeId/finished",
  [
    authToken(),
    validate([
      body("finished").isBoolean().notEmpty(),
      param("quickChallengeId").isUUID().notEmpty(),
    ]),
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.patchFinished(req, res);
  }
);

router.get(
  "/quickChallenge/:quickChallengeId",
  [
    authToken(),
    validate([
      param("quickChallengeId").isUUID().notEmpty()
    ])
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.getQuickChallengeById(req, res)
  }
);

router.delete(
  "/quickChallenge/exit/:quickChallengeId",
  [
    authToken(),
    validate([
      body("userId").isUUID().notEmpty(),
      param("quickChallengeId").isUUID().notEmpty()
    ])
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.exitFromChallengeById(req, res)
  }
);

router.delete(
  "/quickChallenge/removeParticipant/:quickChallengeId",
  [
    authToken(),
    validate([
      body("userId").isUUID().notEmpty(),
      body("userToDeleteId").isUUID().notEmpty(),
      param("quickChallengeId").isUUID().notEmpty()
    ])
  ],
  async (req: Request, res: Response) => {
    quickChallengeController.removeParticipantById(req, res)
  }
);


export default router;
