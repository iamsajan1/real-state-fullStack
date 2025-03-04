import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    });
    if (manager) {
      res.json(manager);
    } else {
      res.status(404).json({ message: "Manager Not Found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving managers: ${error.message}` });
  }
};
export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(manager);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating managers: ${error.message}` });
  }
};
export const updatetManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId}= req.params;
    const { name, email, phoneNumber } = req.body;

    const manager = await prisma.manager.update({
      where:{cognitoId},
      data: {
        name,
        email,
        phoneNumber,
      },
    });
    res.json(updatetManager);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating managers: ${error.message}` });
  }
};
