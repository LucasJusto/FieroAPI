import { User } from "../Model/User.js";
import { UserLoginErrors, UserService } from "../Service/UserService.js";
import uuidV4 from "../utils/uuidv4Generator.js";
import { HTTPCodes } from "../utils/HTTPEnum.js";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
  async handleRegister(req: Request, res: Response) {
    const { email, name, password } = req.body;
    const user = new User(uuidV4(), email, name, password);

    try {
      const userWithoutPassword = await userService.createAccount(user);
      const ret = await userService.getUserAuthToken(
        req.body.email,
        req.body.password
      );
      res.status(HTTPCodes.Created).json({ token: ret[0], user: userWithoutPassword });
    } catch (error) {
      switch (error.code) {
        case "23505":
          //trying to duplicate an unique key
          res.status(HTTPCodes.Conflict).json(error.message);
          return;
        default:
          res.status(HTTPCodes.InternalServerError).json(error.message);
          return;
      }
    }
  }

  async handleLogin(req: Request, res: Response) {
    try {
      const ret = await userService.getUserAuthToken(
        req.body.email,
        req.body.password
      );
      res.status(HTTPCodes.Success).json({ token: ret[0], user: ret[1] });
    } catch (error) {
      switch (error.message) {
        case UserLoginErrors.wrongEmailPasswordCombination:
          res.status(HTTPCodes.Forbidden).json(error.message);
          return;
        case UserLoginErrors.userNotFound:
          res.status(HTTPCodes.NotFound).json(error.message);
          return;
        default:
          res.status(HTTPCodes.InternalServerError).json(error);
          return;
      }
    }
  }

  async handleVerificationCode(req: Request, res: Response) {
    const { email } = req.body
    const user = await userService.getUserByEmail(email)
    
    if(user.id.length > 0 && user.email.length > 0) {
      try {
        //creates and saves verification code
        const verificationCode = await userService.createVerificationCodeForUser(user.id)

        //sends it to the user's email
        const sendMail = await userService.sendMail(email, verificationCode)

        res.status(HTTPCodes.Created).json('Verification code created and sent to user!')
        return
      }
      catch(error) {
        res.status(HTTPCodes.InternalServerError).json(error)
        return
      }
    }
    else {
      res.status(HTTPCodes.NotFound).json('User not found!')
      return
    }
  }

  async handlePasswordPatch(req: Request, res: Response) {
    const { verificationCode, newPassword, email } = req.body

    try {
      const permission = await userService.checkVerificationCode(verificationCode, email)

      if(permission) {
        const user = await userService.patchPassword(email, newPassword)
        res.status(HTTPCodes.Success).json('Successfully changed password!')
        return
      }
      else {
        res.status(HTTPCodes.Unauthorized).json('wrong or expired verification code')
        return
      }
    }
    catch(error) {
      if(error.code === '22P02') {
        res.status(HTTPCodes.Unauthorized).json('wrong or expired verification code')
        return
      }
      else {
        res.status(HTTPCodes.InternalServerError).json(error)
        return
      }
    }
  }

  async handleAccountDeletion(req: Request, res: Response) {
    try {
      const onDeleteUser = await userService.getUserById(req.params.id);

      if (onDeleteUser) {
        if (onDeleteUser.id === req.params.id) {
          try {
            await userService.wipeUserData(onDeleteUser);
            res.status(HTTPCodes.Success).json({
              message: "User data was wiped successfully",
            });
          } catch (error) {
            res.status(HTTPCodes.InternalServerError).json({ error: error });
            return;
          }
        } else {
          res
            .status(HTTPCodes.Forbidden)
            .json({ error: "Permission to delete account denied" });
          return;
        }
      } else {
        res.status(HTTPCodes.NotFound).json({ error: "User not found" });
        return;
      }
    } catch (error) {
      res.status(HTTPCodes.InternalServerError).json({ error: error });
    }
  }

 async getUserToken(req:Request, res: Response) {
  try {
    const ret = await userService.getUserAuthToken(
      req.body.email,
      req.body.password
    );
    res.status(HTTPCodes.Success).json({ token: ret[0] });
  } catch (error) {
    switch (error.message) {
      case UserLoginErrors.wrongEmailPasswordCombination:
        res.status(HTTPCodes.Forbidden).json(error.message);
        return;
      case UserLoginErrors.userNotFound:
        res.status(HTTPCodes.NotFound).json(error.message);
        return;
      default:
        res.status(HTTPCodes.InternalServerError).json(error);
        return;
    }
  }
 }
}
