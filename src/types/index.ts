export type ProcessType = {
  id: number;
  name: string;
  active: boolean;
};

export type MaterialsType = {
  id: number;
  processId: number;
  name: string;
  color?: string[];
  infill?: string[];
  tolerance?: {
    default?: number;
    options?: number[];
  };
  active: boolean;
  isCustom: boolean;
  index?: number;
};

export type FinishesType = {
  id: number;
  processId: number;
  name: string;
  restrictedMaterials: number[];
  isCustom: boolean;
  index?: number;
};

export type ManufacturingProcessAndMaterialsParametersType = {
  processes: ProcessType[];
  materials: MaterialsType[];
  finishes: FinishesType[];
};

export type OtherPropsType = {
  color?: string | null;
  infill?: string | null;
  tolerance?: number | null;
  quantity?: number;
  customMaterial?: string | null;
  customFinish?: string | null;
  threads?: number;
  inserts?: number;
};
