import type { Vehicle } from '../../data/data-types';

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'isActive'>;
export type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt'>>;
