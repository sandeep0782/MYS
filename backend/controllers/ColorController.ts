import { Request, Response } from "express";
import Color, { IColor } from "../models/Color";

// Get all colors
export const getColors = async (req: Request, res: Response) => {
  try {
    const colors: IColor[] = await Color.find();
    res.status(200).json({ success: true, data: colors });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch colors", error });
  }
};

// Get a single color by ID
export const getColorById = async (req: Request, res: Response) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color)
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    res.status(200).json({ success: true, data: color });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch color", error });
  }
};

// Create a new color
export const createColor = async (req: Request, res: Response) => {
  try {
    const { name, hexCode } = req.body;
    const color = new Color({ name, hexCode });
    await color.save();
    res.status(201).json({ success: true, data: color });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create color", error });
  }
};

// Update a color
export const updateColor = async (req: Request, res: Response) => {
  try {
    const { name, hexCode } = req.body;
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { name, hexCode },
      { new: true }
    );
    if (!color)
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    res.status(200).json({ success: true, data: color });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update color", error });
  }
};

// Delete a color
export const deleteColor = async (req: Request, res: Response) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color)
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    res
      .status(200)
      .json({ success: true, message: "Color deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete color", error });
  }
};
