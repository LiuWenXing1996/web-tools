import type { H3Event } from "h3";
import prisma from "./prisma";
import bcrypt from "bcrypt";

interface UserSessionData {
  id: string;
}

export const useUserSession = async (event: H3Event) => {
  const maxAge = 60 * 60 * 24 * 7;
  return await useSession<Partial<UserSessionData>>(event, {
    password: getUserSessionPassword(),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    },
    name: "vico-user-token-session",
  });
};

const getUserSessionPassword = () => {
  const password = process.env.USER_SESSION_PASSWORD;
  if (!password) {
    throw createError({
      statusCode: 500,
      message: "undefined USER_SESSION_PASSWORD",
    });
  }
  return password;
};

export const getUseById = async (id?: string) => {
  if (!id) {
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      isSuper: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const getCurrentUser = async (event: H3Event) => {
  const userSession = await useUserSession(event);
  const userId = userSession.data.id;
  return await getUseById(userId);
};

export const requireCurrentUser = async (event: H3Event) => {
  const user = await getCurrentUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "用户未登录",
    });
  }
  return user;
};
export const requireCurrentAdminUser = async (event: H3Event) => {
  const user = await requireCurrentUser(event);
  if (!(user.isAdmin || user.isSuper)) {
    throw createError({
      statusCode: 403,
      message: "用户不是管理员",
    });
  }
  return user;
};

export interface UserSetting {}

export const getUserSetting = async (userName: string) => {
  const user = await prisma.user.findFirst({
    where: {
      name: userName,
    },
    select: {
      setting: true,
    },
  });
  const settingJson = user?.setting;
  let setting: UserSetting | undefined = undefined;
  try {
    setting = JSON.parse(settingJson || "");
  } catch (error) {}
  return setting;
};

export const encryptUserPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const compareUserPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
