import { Call } from "@prisma/client";
import prismaClient from "../../prisma/prisma.client";
import { CreateCallDto, UpdateCallDto } from "../interfaces/call.interface";

export const fetchCalls = async (): Promise<Call[]> => {
  return await prismaClient.call.findMany({});
};

export const createCall = async (callData: CreateCallDto): Promise<Call> => {
  return await prismaClient.call.create({
    data: callData
  });
};

export const readCall = async (id: number): Promise<Call | null> => {
  return await prismaClient.call.findUnique({
    where: { id }
  });
};

export const updateCall = async (id: number, callData: UpdateCallDto): Promise<Call> => {
  return await prismaClient.call.update({
    where: { id },
    data: callData
  });
};

export const deleteCall = async (id: number): Promise<void> => {
  await prismaClient.call.delete({
    where: { id }
  });
};
