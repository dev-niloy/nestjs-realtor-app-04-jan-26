import { PropertyType } from 'src/generated/prisma/enums';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  address: string;

  city: string;

  price: number;
  land_size: number;
  propertyType: PropertyType;
  created_at: Date;
  updated_at: Date;
  realtor_id: number;

  @Exclude()
  number_of_bedrooms: number;
  @Exclude()
  number_of_bathrooms: number;
  @Exclude()
  listed_date: Date;

  @Expose({ name: 'numberOfBedrooms' })
  transformNumberOfBedrooms() {
    return this.number_of_bedrooms;
  }
  @Expose({ name: 'numberOfBathrooms' })
  transformNumberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  @Expose({ name: 'listedDate' })
  transformListedDate() {
    return this.listed_date;
  }

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
