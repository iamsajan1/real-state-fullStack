import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { wktToGeoJSON } from "@terraformer/wkt";

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
export const updatedTenant = async (
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
    res.json(updatedTenant);
  } 

  catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating tenant: ${error.message}` });
  }
};


export const getCurrentResidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const properties = await prisma.property.findMany({
      where: { tenants: { some: { cognitoId } } },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );

    res.json(residencesWithFormattedLocation);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${err.message}` });
  }
};


export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try { 
const {cognitoId, propertyId}= req.params;
const tenant = await prisma.tenant.findUnique({
  where:{cognitoId},
  include:{favorites: true},
  
});

const propertyIdNumber=Number(propertyId);
const existingFavorites=tenant?.favorites ||[];

if(!existingFavorites.some((fav)=> fav.id === propertyIdNumber)){
  const UpdatedTenant= await prisma.tenant.update({
    where:{cognitoId},
    data:{
      favorites:{
        connect:{id:propertyIdNumber}
      }
    },
    include:{favorites:true}
  })
  res.json(UpdatedTenant)
}
else{
  res.status(409).json({message:"Property already added as favorite"})
}
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error adding favorite properties: ${err.message}` });
  }
};


export const removeFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try { 
const {cognitoId, propertyId}= req.params;
const propertyIdNumber=Number(propertyId);
const updatedTenant=await prisma.tenant.update({
  where:{cognitoId},
  data:{
    favorites:{
      disconnect:{id:propertyIdNumber}
    }
  },
  include:{favorites:true}
})
 res.json(updatedTenant);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error removing favorite properties: ${err.message}` });
  }
};
