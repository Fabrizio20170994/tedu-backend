import { IsMilitaryTime, IsNumber, Max, Min } from "class-validator";

export class schedule{
    
    @IsNumber()
    @Min(0)
    @Max(7)
    day: number;

    @IsMilitaryTime()
    start: string;

    @IsMilitaryTime()
    end: string;

}