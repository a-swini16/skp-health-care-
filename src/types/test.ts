export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface LabTest {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  method?: string;
  sampleType: string;
  price: number;
  turnAroundTimeHours: number;
  isActive: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  department?: Department; // Joined
}

export interface TestParameter {
  id: string;
  testId: string;
  name: string;
  unit?: string;
  referenceRangeMale?: string;
  referenceRangeFemale?: string;
  minCriticalValue?: number;
  maxCriticalValue?: number;
  displayOrder: number;
  isNumeric: boolean;
}

export interface CreateLabTestDTO {
  departmentId: string;
  code: string;
  name: string;
  method?: string;
  sampleType: string;
  price: number;
  turnAroundTimeHours: number;
}
export interface CreateDepartmentDTO {
  name: string;
  description?: string;
}

export interface CreateTestParameterDTO {
  testId: string;
  name: string;
  unit?: string;
  referenceRangeMale?: string;
  referenceRangeFemale?: string;
  minCriticalValue?: number;
  maxCriticalValue?: number;
  displayOrder: number;
  isNumeric: boolean;
}
