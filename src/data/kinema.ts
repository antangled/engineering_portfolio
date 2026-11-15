import { withBase } from "../lib/withBase";

/**
 * Kinema's RO80 cycloidal drive, from Adam's Onshape export (16 parts, already in
 * assembly coordinates, actuator axis = +z, output plates at the top). The parts
 * were merged into one meshopt-compressed GLB; node names are the Onshape part
 * names with spaces turned into underscores (three's GLTFLoader does that).
 */
export const KINEMA_MODEL = withBase("/models/kinema.glb");

/** Measured from the disc geometry: each disc's centroid sits 1.000 mm off the axis, 180° apart. */
export const ECCENTRICITY = 0.001;
/** 10 lobes on each disc (counted from the mesh), so the output turns at 1/10 of the input. */
export const RATIO = 10;

export type PartRole = "shaft" | "disc" | "output" | "fixed";

/** `detail` only where the geometry itself shows it (lobes, offset, phase). */
export type LabelGroup = { id: string; label: string; detail?: string };

export const LABELS: LabelGroup[] = [
  { id: "controller", label: "Motor controller" },
  { id: "encoder", label: "Encoder cap" },
  { id: "housing", label: "Housing", detail: "Enclosure, cap and base plate" },
  { id: "cage", label: "Pin cage", detail: "Fixed ring the discs roll against" },
  { id: "discs", label: "Cycloidal discs ×2", detail: "10 lobes each, 180° apart" },
  { id: "shaft", label: "Eccentric shaft", detail: "Input, with a 1 mm offset" },
  { id: "output", label: "Output plates", detail: "One turn per 10 input turns" },
];

type PartDef = {
  group: LabelGroup["id"];
  /** Exploded offset along the axis, in mm. */
  explode: number;
  role: PartRole;
  /** Disc phase on the eccentric, radians (bottom disc +y, top disc -y). */
  phase?: number;
};

export const PARTS: Record<string, PartDef> = {
  // back half slides away from the output: housing first, then caps and controller
  Controller_Cap: { group: "controller", explode: -165, role: "fixed" },
  Motor_Controller: { group: "controller", explode: -146, role: "fixed" },
  Standoff: { group: "controller", explode: -132, role: "fixed" },
  Standoff_1: { group: "controller", explode: -132, role: "fixed" },
  Standoff_2: { group: "controller", explode: -132, role: "fixed" },
  Standoff_3: { group: "controller", explode: -132, role: "fixed" },
  Encoder_Cap: { group: "encoder", explode: -118, role: "fixed" },
  Enclosure_Cap: { group: "housing", explode: -98, role: "fixed" },
  Enclosure: { group: "housing", explode: -70, role: "fixed" },
  // the drive itself comes out toward the output side
  Base_Plate: { group: "housing", explode: 0, role: "fixed" },
  Cycloidal_Cage: { group: "cage", explode: 30, role: "fixed" },
  Slow_Shaft_Bottom_Plate: { group: "output", explode: 70, role: "output" },
  Bottom_Cycloidal_Gear: { group: "discs", explode: 84, role: "disc", phase: Math.PI / 2 },
  Eccentric_Shaft: { group: "shaft", explode: 102, role: "shaft" },
  Top_Cycloidal_Gear: { group: "discs", explode: 108, role: "disc", phase: -Math.PI / 2 },
  Slow_Shaft_Top_Plate: { group: "output", explode: 128, role: "output" },
};

/** Axial extent (mm) of the stack, assembled and fully exploded, for centring and camera fit. */
export const SPAN = { assembled: [-20.5, 38], exploded: [-185.5, 166] } as const;

/** Which part each label points at, and on which side of the axis it sits. */
export const LABEL_ANCHORS: Record<LabelGroup["id"], { part: string; side: 1 | -1 }> = {
  controller: { part: "Motor_Controller", side: 1 },
  encoder: { part: "Encoder_Cap", side: -1 },
  housing: { part: "Enclosure", side: 1 },
  cage: { part: "Cycloidal_Cage", side: -1 },
  discs: { part: "Bottom_Cycloidal_Gear", side: 1 },
  shaft: { part: "Eccentric_Shaft", side: -1 },
  output: { part: "Slow_Shaft_Top_Plate", side: 1 },
};
