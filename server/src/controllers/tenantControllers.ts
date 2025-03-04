import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });
    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenants Not Found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tenants: ${error.message}` });
  }
};
export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(tenant);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating tenants: ${error.message}` });
  }
};
export const updatetTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {cognitoId}=req.params
    const { name, email, phoneNumber } = req.body;

    const tenant = await prisma.tenant.update({
      where:{cognitoId},
      data: {
        name,
        email,
        phoneNumber,
      },
    });
    res.json(updatetTenant);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating tenant: ${error.message}` });
  }
};
