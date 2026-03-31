import type { VehicleRecord } from '../../data/data-types';

export type CreateVehicleInput = Omit<VehicleRecord, 'id' | 'createdAt' | 'isActive'>;
export type UpdateVehicleInput = Partial<Omit<VehicleRecord, 'id' | 'createdAt'>>;
