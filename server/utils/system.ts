import prisma from "~/lib/prisma";
import CryptoJS from "crypto-js";
import { Tool } from "@prisma/client";

export const getSystemConfig = async () => {
  return prisma.systemConfig.findFirst();
};

export const isSystemInited = async () => {
  const envInited = process.env.SYSTEM_INITED;
  if (envInited !== undefined) {
    console.log({ envInited });
    return Boolean(envInited);
  }
  const systemConfig = await getSystemConfig();
  return Boolean(systemConfig);
};

export const genDefaultSystemConfig = () => {
  const cryptoPassword = "fsdgfhsdjgfhjdsgfhjsdg";
  const userSessionPassword = "password-with-at-least-32-characterssssss";
  return {
    cryptoPassword,
    userSessionPassword,
  };
};

export const getDbCryptoHelper = async () => {
  const systemConfig = await getSystemConfig();
  if (!systemConfig) {
    throw createError({
      statusCode: 500,
      message: "undefined systemConfig",
    });
  }
  const password = systemConfig.cryptoPassword;
  if (!password) {
    throw createError({
      statusCode: 500,
      message: "undefined systemConfig cryptoPassword",
    });
  }
  return {
    decrypt: (value: string) => {
      return CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
    },
    encrypt: (value: string) => {
      return CryptoJS.AES.encrypt(value, password).toString();
    },
  };
};

export const getDefaultTools = () => {
  const tools: Omit<Tool, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "super-manager",
      title: "所有工具",
      description: null,
      icon: null,
    },
  ];
  return tools;
};

export const initDefaultTools = async () => {
  const tools = getDefaultTools();
  for (const tool of tools) {
    await prisma.tool.upsert({
      where: {
        name: tool.name,
      },
      update: {
        ...tool,
      },
      create: {
        ...tool,
      },
    });
  }
};
