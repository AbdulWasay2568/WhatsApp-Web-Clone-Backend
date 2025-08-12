import { Request, Response } from "express";
import {
  fetchCalls,
  createCall,
  readCall,
  updateCall,
  deleteCall
} from "../services/call.service";
import { CreateCallDto, UpdateCallDto } from "../interfaces/call.interface";
import { io } from "../../socket"; // Make sure this exports the initialized `io`

export const fetchCallsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const calls = await fetchCalls();
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch calls" });
  }
};

export const createCallController = async (req: Request, res: Response): Promise<void> => {
  try {
    const callData: CreateCallDto = req.body;
    const newCall = await createCall(callData);

    // 🔁 Emit new call event to callee
    io.to(newCall.calleeId.toString()).emit("call:incoming", newCall);

    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ error: "Failed to create call" });
  }
};

export const readCallController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const call = await readCall(Number(id));
    if (call) {
      res.status(200).json(call);
    } else {
      res.status(404).json({ error: "Call not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch call" });
  }
};

export const updateCallController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const callData: UpdateCallDto = req.body;
    const updatedCall = await updateCall(Number(id), callData);

    // 🔁 Notify both caller and callee about the update
    io.to(updatedCall.callerId.toString()).emit("call:updated", updatedCall);
    io.to(updatedCall.calleeId.toString()).emit("call:updated", updatedCall);

    res.status(200).json(updatedCall);
  } catch (error) {
    res.status(500).json({ error: "Failed to update call" });
  }
};

export const deleteCallController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const call = await readCall(Number(id));
    if (!call) {
      res.status(404).json({ error: "Call not found" });
      return;
    }

    await deleteCall(Number(id));

    // 🔁 Emit deletion event to both caller and callee
    io.to(call.callerId.toString()).emit("call:ended", { id: call.id });
    io.to(call.calleeId.toString()).emit("call:ended", { id: call.id });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete call" });
  }
};
